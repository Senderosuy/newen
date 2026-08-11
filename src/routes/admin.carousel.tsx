import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage, swapOrder, deleteRow } from "@/lib/admin";
import type { CarouselSlide } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { ArrowUp, ArrowDown, Trash2, Plus, ImagePlus } from "lucide-react";

export const Route = createFileRoute("/admin/carousel")({
  component: AdminCarousel,
});

function AdminCarousel() {
  const [slides, setSlides] = useState<CarouselSlide[]>([]);
  const [busy, setBusy] = useState(false);
  const [newSlide, setNewSlide] = useState({ title: "", subtitle: "" });
  const [newFile, setNewFile] = useState<File | null>(null);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("carousel_slides")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) toast.error(error.message);
    else setSlides(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFile) {
      toast.error("Seleccioná una imagen para el slide.");
      return;
    }
    setBusy(true);
    try {
      const url = await uploadImage(newFile, "carousel");
      const maxOrder = Math.max(0, ...slides.map((s) => s.sort_order ?? 0));
      const { error } = await supabase.from("carousel_slides").insert({
        image_url: url,
        title: newSlide.title,
        subtitle: newSlide.subtitle,
        sort_order: maxOrder + 1,
      });
      if (error) throw error;
      toast.success("Slide agregado.");
      setNewSlide({ title: "", subtitle: "" });
      setNewFile(null);
      (document.getElementById("new-slide-file") as HTMLInputElement | null)?.form?.reset();
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Error al crear el slide.");
    } finally {
      setBusy(false);
    }
  };

  const handleUpdateText = async (slide: CarouselSlide) => {
    setBusy(true);
    const { error } = await supabase
      .from("carousel_slides")
      .update({ title: slide.title, subtitle: slide.subtitle })
      .eq("id", slide.id);
    setBusy(false);
    if (error) toast.error(error.message);
    else toast.success("Textos guardados.");
  };

  const handleReplaceImage = async (slide: CarouselSlide, file: File) => {
    setBusy(true);
    try {
      const url = await uploadImage(file, "carousel");
      const { error } = await supabase
        .from("carousel_slides")
        .update({ image_url: url })
        .eq("id", slide.id);
      if (error) throw error;
      toast.success("Imagen reemplazada.");
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Error al subir la imagen.");
    } finally {
      setBusy(false);
    }
  };

  const handleMove = async (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= slides.length) return;
    setBusy(true);
    try {
      const slideA = slides[index];
      const slideB = slides[target];
      if (!slideA || !slideB) return;
      await swapOrder("carousel_slides", slideA, slideB);
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar este slide del carrusel?")) return;
    setBusy(true);
    try {
      await deleteRow("carousel_slides", id);
      toast.success("Slide eliminado.");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">Gestor de Carrusel</h2>
      <p className="text-muted-foreground text-sm mb-8">
        Imágenes y frases del carrusel principal de la portada.
      </p>

      <form
        onSubmit={handleCreate}
        className="bg-card border border-border rounded-2xl p-6 mb-10 space-y-4"
      >
        <h3 className="font-bold flex items-center gap-2">
          <Plus size={18} /> Nuevo slide
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Frase principal</Label>
            <Input
              value={newSlide.title}
              onChange={(e) => setNewSlide({ ...newSlide, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label>Subtítulo</Label>
            <Input
              value={newSlide.subtitle}
              onChange={(e) => setNewSlide({ ...newSlide, subtitle: e.target.value })}
              required
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="new-slide-file">Imagen (alta resolución, horizontal)</Label>
          <Input
            id="new-slide-file"
            type="file"
            accept="image/*"
            onChange={(e) => setNewFile(e.target.files?.[0] ?? null)}
          />
        </div>
        <Button type="submit" disabled={busy}>
          {busy ? "Guardando..." : "Agregar slide"}
        </Button>
      </form>

      <div className="space-y-6">
        {slides.map((slide, index) => (
          <div
            key={slide.id}
            className="bg-card border border-border rounded-2xl p-4 flex flex-col md:flex-row gap-4"
          >
            <img
              src={slide.image_url}
              alt={slide.title}
              className="w-full md:w-56 aspect-video object-cover rounded-xl shrink-0"
              loading="lazy"
            />
            <div className="flex-1 space-y-3">
              <Input
                value={slide.title}
                onChange={(e) =>
                  setSlides(slides.map((s) => (s.id === slide.id ? { ...s, title: e.target.value } : s)))
                }
              />
              <Input
                value={slide.subtitle}
                onChange={(e) =>
                  setSlides(
                    slides.map((s) => (s.id === slide.id ? { ...s, subtitle: e.target.value } : s)),
                  )
                }
              />
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm" disabled={busy} onClick={() => handleUpdateText(slide)}>
                  Guardar textos
                </Button>
                <label className="inline-flex">
                  <input
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={(e) => {
                      const f = e.target.files?.[0];
                      if (f) handleReplaceImage(slide, f);
                    }}
                  />
                  <span className="inline-flex items-center gap-1.5 h-9 px-3 rounded-md border border-input bg-background text-sm font-medium cursor-pointer hover:bg-accent">
                    <ImagePlus size={15} /> Cambiar imagen
                  </span>
                </label>
                <Button size="sm" variant="ghost" disabled={busy || index === 0} onClick={() => handleMove(index, -1)}>
                  <ArrowUp size={16} />
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  disabled={busy || index === slides.length - 1}
                  onClick={() => handleMove(index, 1)}
                >
                  <ArrowDown size={16} />
                </Button>
                <Button size="sm" variant="destructive" disabled={busy} onClick={() => handleDelete(slide.id)}>
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          </div>
        ))}
        {slides.length === 0 && (
          <p className="text-muted-foreground text-sm">No hay slides cargados todavía.</p>
        )}
      </div>
    </div>
  );
}
