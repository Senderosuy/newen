import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage, swapOrder } from "@/lib/admin";
import type { FleetVehicle } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, ArrowLeft, ArrowRight, Trash2, ImagePlus } from "lucide-react";

export const Route = createFileRoute("/admin/fleet")({
  component: AdminFleet,
});

function AdminFleet() {
  const [fleet, setFleet] = useState<FleetVehicle[]>([]);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("fleet")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setFleet(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const update = (id: string, patch: Partial<FleetVehicle>) =>
    setFleet(fleet.map((v) => (v.id === id ? { ...v, ...patch } : v)));

  const featuresToText = (features: any): string =>
    Array.isArray(features) ? features.join("\n") : "";

  const handleSave = async (vehicle: FleetVehicle & { _featuresText?: string }) => {
    setBusy(true);
    const features =
      vehicle._featuresText !== undefined
        ? vehicle._featuresText.split("\n").map((l) => l.trim()).filter(Boolean)
        : vehicle.features;
    const { error } = await supabase
      .from("fleet")
      .update({
        name: vehicle.name,
        capacity: vehicle.capacity,
        description: vehicle.description,
        features,
      })
      .eq("id", vehicle.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else {
      toast.success("Vehículo guardado.");
      await load();
    }
  };

  const saveImages = async (id: string, images: string[]) => {
    const { error } = await supabase.from("fleet").update({ images }).eq("id", id);
    if (error) throw error;
    await load();
  };

  const handleAddImages = async (vehicle: FleetVehicle, files: FileList) => {
    setBusy(true);
    try {
      const urls: string[] = [];
      for (const file of Array.from(files)) {
        urls.push(await uploadImage(file, `fleet/${vehicle.id}`));
      }
      await saveImages(vehicle.id, [...(vehicle.images ?? []), ...urls]);
      toast.success(`${urls.length} foto(s) agregada(s).`);
    } catch (err: any) {
      toast.error(err.message ?? "Error al subir fotos.");
    } finally {
      setBusy(false);
    }
  };

  const handleRemoveImage = async (vehicle: FleetVehicle, index: number) => {
    if (!confirm("¿Quitar esta foto de la galería?")) return;
    setBusy(true);
    try {
      const images = [...vehicle.images];
      images.splice(index, 1);
      await saveImages(vehicle.id, images);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleMoveImage = async (vehicle: FleetVehicle, index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= vehicle.images.length) return;
    setBusy(true);
    try {
      const images = [...vehicle.images];
      const imgA = images[index];
      const imgB = images[target];
      if (imgA === undefined || imgB === undefined) return;
      [images[index], images[target]] = [imgB, imgA];
      await saveImages(vehicle.id, images);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleMoveVehicle = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= fleet.length) return;
    setBusy(true);
    try {
      const vehicleA = fleet[index];
      const vehicleB = fleet[target];
      if (!vehicleA || !vehicleB) return;
      await swapOrder("fleet", vehicleA, vehicleB);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Gestor de Flota</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Datos técnicos y galerías de fotos de cada vehículo. Las características van una por línea.
      </p>

      <div className="space-y-10">
        {fleet.map((vehicle, index) => (
          <div key={vehicle.id} className="bg-card border border-border rounded-2xl p-6 space-y-5">
            <div className="flex items-center justify-between gap-2">
              <h3 className="font-bold text-lg">{vehicle.name}</h3>
              <div className="flex gap-1">
                <Button size="sm" variant="ghost" disabled={busy || index === 0} onClick={() => handleMoveVehicle(index, -1)}>
                  <ArrowUp size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy || index === fleet.length - 1}
                  onClick={() => handleMoveVehicle(index, 1)}
                >
                  <ArrowDown size={16} />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1 sm:col-span-2">
                <Label className="text-xs">Nombre</Label>
                <Input value={vehicle.name} onChange={(e) => update(vehicle.id, { name: e.target.value })} />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Capacidad (pasajeros)</Label>
                <Input
                  type="number"
                  value={vehicle.capacity}
                  onChange={(e) => update(vehicle.id, { capacity: Number(e.target.value) })}
                />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Descripción</Label>
              <Textarea
                value={vehicle.description ?? ""}
                onChange={(e) => update(vehicle.id, { description: e.target.value })}
                className="min-h-[60px]"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Características (una por línea)</Label>
              <Textarea
                defaultValue={featuresToText(vehicle.features)}
                onChange={(e) => update(vehicle.id, { _featuresText: e.target.value } as any)}
                className="min-h-[120px] font-mono text-sm"
              />
            </div>
            <Button size="sm" disabled={busy} onClick={() => handleSave(vehicle as any)}>
              Guardar datos
            </Button>

            <div className="border-t border-border pt-5">
              <div className="flex items-center justify-between mb-3">
                <Label>Galería ({vehicle.images?.length ?? 0} fotos)</Label>
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    multiple
                    className="hidden"
                    onChange={(e) => {
                      if (e.target.files?.length) handleAddImages(vehicle, e.target.files);
                    }}
                  />
                  <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input bg-background text-sm font-medium cursor-pointer hover:bg-accent">
                    <ImagePlus size={15} /> Agregar fotos
                  </span>
                </label>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {(vehicle.images ?? []).map((img, i) => (
                  <div key={img + i} className="relative group rounded-lg overflow-hidden border border-border">
                    <img src={img} alt="" className="aspect-video object-cover w-full" loading="lazy" />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1">
                      <Button size="sm" variant="secondary" className="h-7 w-7 p-0" disabled={busy || i === 0} onClick={() => handleMoveImage(vehicle, i, -1)}>
                        <ArrowLeft size={13} />
                      </Button>
                      <Button size="sm" variant="destructive" className="h-7 w-7 p-0" disabled={busy} onClick={() => handleRemoveImage(vehicle, i)}>
                        <Trash2 size={13} />
                      </Button>
                      <Button
                        size="sm"
                        variant="secondary"
                        className="h-7 w-7 p-0"
                        disabled={busy || i === vehicle.images.length - 1}
                        onClick={() => handleMoveImage(vehicle, i, 1)}
                      >
                        <ArrowRight size={13} />
                      </Button>
                    </div>
                  </div>
                ))}
                {(!vehicle.images || vehicle.images.length === 0) && (
                  <p className="text-muted-foreground text-sm col-span-full">Sin fotos cargadas.</p>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
