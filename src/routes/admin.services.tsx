import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { swapOrder } from "@/lib/admin";
import type { Service } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import * as Icons from "lucide-react";
import { ArrowUp, ArrowDown } from "lucide-react";

export const Route = createFileRoute("/admin/services")({
  component: AdminServices,
});

function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("services")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setServices(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleSave = async (service: Service) => {
    setBusy(true);
    const { error } = await supabase
      .from("services")
      .update({ title: service.title, description: service.description, icon: service.icon })
      .eq("id", service.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Servicio guardado.");
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= services.length) return;
    setBusy(true);
    try {
      await swapOrder("services", services[index], services[target]);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const update = (id: string, patch: Partial<Service>) =>
    setServices(services.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Gestor de Servicios</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Editá el título, la descripción, el ícono y el orden de las cards de servicios. Los íconos
        son nombres de{" "}
        <a href="https://lucide.dev/icons" target="_blank" rel="noopener noreferrer" className="underline">
          lucide.dev/icons
        </a>{" "}
        (ej: MapPin, Briefcase, Users, Calendar).
      </p>

      <div className="space-y-6">
        {services.map((service, index) => {
          const IconComponent = (Icons as any)[service.icon] || Icons.HelpCircle;
          return (
            <div key={service.id} className="bg-card border border-border rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary shrink-0">
                  <IconComponent size={20} />
                </div>
                <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <Label className="text-xs">Título</Label>
                    <Input
                      value={service.title}
                      onChange={(e) => update(service.id, { title: e.target.value })}
                    />
                  </div>
                  <div className="space-y-1">
                    <Label className="text-xs">Ícono (nombre lucide)</Label>
                    <Input
                      value={service.icon}
                      onChange={(e) => update(service.id, { icon: e.target.value })}
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Descripción</Label>
                <Textarea
                  value={service.description}
                  onChange={(e) => update(service.id, { description: e.target.value })}
                  className="min-h-[70px]"
                />
              </div>
              <div className="flex items-center gap-2">
                <Button size="sm" disabled={busy} onClick={() => handleSave(service)}>
                  Guardar
                </Button>
                <Button size="sm" variant="ghost" disabled={busy || index === 0} onClick={() => handleMove(index, -1)}>
                  <ArrowUp size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy || index === services.length - 1}
                  onClick={() => handleMove(index, 1)}
                >
                  <ArrowDown size={16} />
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
