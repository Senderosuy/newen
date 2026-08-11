import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

interface Counts {
  slides: number;
  vehicles: number;
  posts: number;
  services: number;
}

function AdminDashboard() {
  const [counts, setCounts] = useState<Counts | null>(null);

  useEffect(() => {
    async function load() {
      const [slides, vehicles, posts, services] = await Promise.all([
        supabase.from("carousel_slides").select("id", { count: "exact", head: true }),
        supabase.from("fleet").select("id", { count: "exact", head: true }),
        supabase.from("blog_posts").select("id", { count: "exact", head: true }),
        supabase.from("services").select("id", { count: "exact", head: true }),
      ]);
      setCounts({
        slides: slides.count ?? 0,
        vehicles: vehicles.count ?? 0,
        posts: posts.count ?? 0,
        services: services.count ?? 0,
      });
    }
    load().catch(console.error);
  }, []);

  const cards = [
    { label: "Slides del carrusel", value: counts?.slides, to: "/admin/carousel" },
    { label: "Publicaciones de blog", value: counts?.posts, to: "/admin/blog" },
    { label: "Servicios", value: counts?.services, to: "/admin/services" },
    { label: "Vehículos", value: counts?.vehicles, to: "/admin/fleet" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-8">Panel de Control</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((c) => (
          <Link
            key={c.label}
            to={c.to}
            className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
          >
            <h3 className="text-muted-foreground text-sm font-medium mb-2">{c.label}</h3>
            <p className="text-3xl font-bold">{c.value ?? "…"}</p>
          </Link>
        ))}
      </div>
      <div className="mt-12 bg-card p-8 rounded-2xl border border-border shadow-sm">
        <h3 className="font-bold text-lg mb-3">Gestión del sitio</h3>
        <p className="text-muted-foreground text-sm">
          Desde el menú lateral podés administrar las imágenes y frases del carrusel, publicar
          novedades en el blog, editar los servicios, actualizar la flota con sus galerías de fotos
          y cambiar los datos de contacto del sitio (WhatsApp, teléfono, email y redes).
        </p>
      </div>
    </div>
  );
}
