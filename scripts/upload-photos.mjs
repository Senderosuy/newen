#!/usr/bin/env node
/**
 * Sube las fotos organizadas al bucket `site-photos` de Supabase Storage.
 * Sin dependencias (usa fetch nativo de Node 18+).
 *
 * Uso (PowerShell / CMD):
 *   set ADMIN_EMAIL=cristian+newen@senderosgroup.com
 *   set ADMIN_PASSWORD=********
 *   set PHOTOS_DIR=C:\Users\Cristian Safie\Documents\SENDEROS APP CS\NEWEN\fotos camionetas
 *   node scripts/upload-photos.mjs
 */
import { readFile } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { join } from "node:path";

const SUPABASE_URL = process.env.SUPABASE_URL || "https://mknhcciovwphpzeeetjt.supabase.co";
const SUPABASE_KEY =
  process.env.SUPABASE_KEY || process.env.VITE_SUPABASE_PUBLISHABLE_KEY || readEnvKey();
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const PHOTOS_DIR = process.env.PHOTOS_DIR || "../fotos camionetas";
const BUCKET = "site-photos";

function readEnvKey() {
  try {
    const env = readFileSync(new URL("../.env", import.meta.url), "utf8");
    const m = env.match(/^VITE_SUPABASE_PUBLISHABLE_KEY="?([^"\n\r]+)"?/m);
    return m?.[1];
  } catch {
    return undefined;
  }
}

// carpeta local relativa a PHOTOS_DIR → ruta en el bucket
const MAPPINGS = [
  // Carrusel
  ["01-carrusel/carrusel-flota-completa-noche.jpg", "carousel/flota-completa-noche.jpg"],
  ["01-carrusel/carrusel-sprinter-campo-atardecer.jpg", "carousel/sprinter-campo-atardecer.jpg"],
  ["01-carrusel/carrusel-sprinter-casino-carrasco-noche.jpg", "carousel/sprinter-casino-carrasco-noche.jpg"],
  ["01-carrusel/carrusel-sprinter-frente.jpg", "carousel/sprinter-frente.jpg"],
  ["01-carrusel/carrusel-sprinter-hotel-carrasco-noche.jpg", "carousel/sprinter-hotel-carrasco-noche.jpg"],
  // Sprinter negra
  ...[
    "sprinter-campo-atardecer.jpg",
    "sprinter-casino-carrasco-noche.jpg",
    "sprinter-frente-puerta-abierta.jpg",
    "sprinter-frente.jpg",
    "sprinter-hotel-carrasco-noche.jpg",
    "sprinter-interior-butacas.jpg",
    "sprinter-interior-claraboya-luces.jpg",
    "sprinter-lateral-puerta-abierta.jpg",
    "sprinter-puerta-escalon-electrico.jpg",
    "sprinter-trasera-lateral.jpg",
  ].map((f) => [`02-sprinter-515-negra/${f}`, `fleet/sprinter-negra/${f}`]),
  // Renault Master
  ["03-renault-master/master-interior-butacas.jpg", "fleet/renault-master/master-interior-butacas.jpg"],
  ["03-renault-master/master-junto-a-flota-noche.jpg", "fleet/renault-master/master-junto-a-flota-noche.jpg"],
  // Sprinter blanca: "Sprinter blanca (N).jpeg" → sprinter-blanca-NN.jpeg
  ...Array.from({ length: 14 }, (_, i) => [
    `04-sprinter-blanca-515/Sprinter blanca (${i + 1}).jpeg`,
    `fleet/sprinter-blanca/sprinter-blanca-${String(i + 1).padStart(2, "0")}.jpeg`,
  ]),
];

async function login() {
  const res = await fetch(`${SUPABASE_URL}/auth/v1/token?grant_type=password`, {
    method: "POST",
    headers: { apikey: SUPABASE_KEY, "Content-Type": "application/json" },
    body: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
  });
  const json = await res.json();
  if (!res.ok) throw new Error(`Login falló: ${json.error_description || json.msg || res.status}`);
  return json.access_token;
}

async function upload(token, localPath, bucketPath) {
  const buffer = await readFile(join(PHOTOS_DIR, localPath));
  const contentType = bucketPath.endsWith(".jpeg") || bucketPath.endsWith(".jpg") ? "image/jpeg" : "application/octet-stream";
  const res = await fetch(`${SUPABASE_URL}/storage/v1/object/${BUCKET}/${bucketPath}`, {
    method: "POST",
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${token}`,
      "Content-Type": contentType,
      "x-upsert": "true",
    },
    body: buffer,
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Error subiendo ${bucketPath}: ${res.status} ${text}`);
  }
}

async function main() {
  if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Falta ADMIN_EMAIL o ADMIN_PASSWORD en las variables de entorno.");
    process.exit(1);
  }
  if (!SUPABASE_KEY) {
    console.error("No se encontró la clave de Supabase (SUPABASE_KEY o .env).");
    process.exit(1);
  }
  console.log(`Fotos: ${PHOTOS_DIR}`);
  console.log("Iniciando sesión...");
  const token = await login();
  console.log(`Sesión OK. Subiendo ${MAPPINGS.length} fotos al bucket "${BUCKET}"...`);

  let ok = 0;
  for (const [local, remote] of MAPPINGS) {
    try {
      await upload(token, local, remote);
      ok++;
      console.log(`  ✓ ${remote}`);
    } catch (err) {
      console.error(`  ✗ ${err.message}`);
    }
  }
  console.log(`\nListo: ${ok}/${MAPPINGS.length} fotos subidas.`);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
