import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { SiteSettings } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

export const Route = createFileRoute("/admin/settings")({
  component: AdminSettings,
});

const FIELDS: { key: keyof SiteSettings; label: string; hint?: string }[] = [
  { key: "whatsapp_number", label: "WhatsApp", hint: "Formato: +59899738955 (con + y código de país)" },
  { key: "phone", label: "Teléfono visible" },
  { key: "email", label: "Email de contacto" },
  { key: "instagram", label: "Instagram", hint: "Usuario o URL" },
  { key: "facebook", label: "Facebook", hint: "Usuario o URL" },
  { key: "coverage_area", label: "Zona de cobertura" },
];

function AdminSettings() {
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    supabase
      .from("site_settings")
      .select("*")
      .single()
      .then(({ data, error }) => {
        if (error) toast.error(error.message);
        else setSettings(data);
      });
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!settings) return;
    setBusy(true);
    const { id, ...payload } = settings as any;
    delete payload.created_at;
    const { error } = await supabase.from("site_settings").update(payload).eq("id", id);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Configuración guardada.");
  };

  if (!settings) {
    return <p className="text-muted-foreground animate-pulse">Cargando configuración...</p>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Configuración del Sitio</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Datos de contacto y redes que se muestran en el sitio público.
      </p>

      <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 space-y-5 max-w-xl">
        {FIELDS.map(({ key, label, hint }) => (
          <div key={key} className="space-y-1">
            <Label>{label}</Label>
            <Input
              value={(settings[key] as string) ?? ""}
              onChange={(e) => setSettings({ ...settings, [key]: e.target.value })}
            />
            {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
          </div>
        ))}
        <Button type="submit" disabled={busy}>
          {busy ? "Guardando..." : "Guardar cambios"}
        </Button>
      </form>
    </div>
  );
}
