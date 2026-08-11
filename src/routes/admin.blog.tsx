import { createFileRoute } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { uploadImage, deleteRow, slugify } from "@/lib/admin";
import type { BlogPost } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RichTextEditor } from "@/components/admin/RichTextEditor";
import { toast } from "sonner";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Pencil, Trash2, Plus } from "lucide-react";

export const Route = createFileRoute("/admin/blog")({
  component: AdminBlog,
});

const EMPTY_FORM = {
  id: null as string | null,
  title: "",
  slug: "",
  cover_url: null as string | null,
  excerpt: "",
  content: "",
  status: "draft",
};

function AdminBlog() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [form, setForm] = useState({ ...EMPTY_FORM });
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [editing, setEditing] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const { data, error } = await supabase
      .from("blog_posts")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) toast.error(error.message);
    else setPosts(data ?? []);
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const startNew = () => {
    setForm({ ...EMPTY_FORM });
    setCoverFile(null);
    setEditing(true);
  };

  const startEdit = (post: BlogPost) => {
    setForm({
      id: post.id,
      title: post.title,
      slug: post.slug,
      cover_url: post.cover_url,
      excerpt: post.excerpt ?? "",
      content: post.content,
      status: post.status,
    });
    setCoverFile(null);
    setEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    try {
      let coverUrl = form.cover_url;
      if (coverFile) coverUrl = await uploadImage(coverFile, "blog");

      const payload = {
        title: form.title,
        slug: form.slug || slugify(form.title),
        cover_url: coverUrl,
        excerpt: form.excerpt || null,
        content: form.content,
        status: form.status,
        published_at:
          form.status === "published"
            ? (posts.find((p) => p.id === form.id)?.published_at ?? new Date().toISOString())
            : null,
      };

      const { error } = form.id
        ? await supabase.from("blog_posts").update(payload).eq("id", form.id)
        : await supabase.from("blog_posts").insert(payload);
      if (error) throw error;

      toast.success(form.id ? "Publicación actualizada." : "Publicación creada.");
      setEditing(false);
      setForm({ ...EMPTY_FORM });
      setCoverFile(null);
      await load();
    } catch (err: any) {
      toast.error(err.message ?? "Error al guardar.");
    } finally {
      setBusy(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("¿Eliminar esta publicación definitivamente?")) return;
    setBusy(true);
    try {
      await deleteRow("blog_posts", id);
      toast.success("Publicación eliminada.");
      await load();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-2xl font-bold">Editor de Blog</h2>
        {!editing && (
          <Button onClick={startNew} className="gap-2">
            <Plus size={16} /> Nueva publicación
          </Button>
        )}
      </div>
      <p className="text-muted-foreground text-sm mb-8">
        Solo las publicaciones con estado "Publicado" aparecen en el sitio.
      </p>

      {editing && (
        <form onSubmit={handleSave} className="bg-card border border-border rounded-2xl p-6 mb-10 space-y-4">
          <h3 className="font-bold">{form.id ? "Editar publicación" : "Nueva publicación"}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Título</Label>
              <Input
                value={form.title}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value,
                    slug: form.id ? form.slug : slugify(e.target.value),
                  })
                }
                required
              />
            </div>
            <div className="space-y-2">
              <Label>Slug (URL)</Label>
              <Input
                value={form.slug}
                onChange={(e) => setForm({ ...form, slug: slugify(e.target.value) })}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Imagen de portada</Label>
              <Input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] ?? null)} />
              {form.cover_url && !coverFile && (
                <img src={form.cover_url} alt="Portada actual" className="h-24 rounded-lg object-cover" />
              )}
            </div>
            <div className="space-y-2">
              <Label>Estado</Label>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="draft">Borrador</option>
                <option value="published">Publicado</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <Label>Extracto (aparece en la grilla del blog)</Label>
            <Textarea
              value={form.excerpt}
              onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
              className="min-h-[70px]"
            />
          </div>
          <div className="space-y-2">
            <Label>Contenido</Label>
            <RichTextEditor
              value={form.content}
              onChange={(content) => setForm({ ...form, content })}
              placeholder="Escribí el artículo acá. Usá la barra de arriba para dar formato: negrita, subtítulos, listas y enlaces."
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={busy}>
              {busy ? "Guardando..." : "Guardar"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setEditing(false)}>
              Cancelar
            </Button>
          </div>
        </form>
      )}

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="bg-card border border-border rounded-xl p-4 flex items-center gap-4"
          >
            {post.cover_url && (
              <img src={post.cover_url} alt="" className="w-20 h-14 object-cover rounded-lg shrink-0" loading="lazy" />
            )}
            <div className="flex-1 min-w-0">
              <p className="font-semibold truncate">{post.title}</p>
              <p className="text-xs text-muted-foreground">
                {post.status === "published" ? (
                  <span className="text-green-600 font-medium">Publicado</span>
                ) : (
                  <span className="text-amber-600 font-medium">Borrador</span>
                )}
                {post.published_at &&
                  ` — ${format(new Date(post.published_at), "PPP", { locale: es })}`}
              </p>
            </div>
            <Button size="sm" variant="outline" onClick={() => startEdit(post)}>
              <Pencil size={15} />
            </Button>
            <Button size="sm" variant="destructive" disabled={busy} onClick={() => handleDelete(post.id)}>
              <Trash2 size={15} />
            </Button>
          </div>
        ))}
        {posts.length === 0 && !editing && (
          <p className="text-muted-foreground text-sm">Todavía no hay publicaciones.</p>
        )}
      </div>
    </div>
  );
}
