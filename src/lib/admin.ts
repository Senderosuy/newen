import { supabase } from "@/integrations/supabase/client";

export const PHOTOS_BUCKET = "site-photos";

/** Sube una imagen al bucket público y devuelve su URL pública. */
export async function uploadImage(file: File, folder: string): Promise<string> {
  const clean = file.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9.]+/g, "-")
    .replace(/-+/g, "-");
  const path = `${folder}/${Date.now()}-${clean}`;

  const { error } = await supabase.storage
    .from(PHOTOS_BUCKET)
    .upload(path, file, { upsert: true, contentType: file.type });
  if (error) throw error;

  const { data } = supabase.storage.from(PHOTOS_BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

/** Intercambia el sort_order de dos filas (para reordenar). */
export async function swapOrder(
  table: "carousel_slides" | "services" | "fleet",
  a: { id: string; sort_order: number | null },
  b: { id: string; sort_order: number | null },
) {
  const { error: e1 } = await supabase
    .from(table)
    .update({ sort_order: b.sort_order ?? 0 })
    .eq("id", a.id);
  if (e1) throw e1;
  const { error: e2 } = await supabase
    .from(table)
    .update({ sort_order: a.sort_order ?? 0 })
    .eq("id", b.id);
  if (e2) throw e2;
}

export async function deleteRow(
  table: "carousel_slides" | "services" | "fleet" | "blog_posts",
  id: string,
) {
  const { error } = await supabase.from(table).delete().eq("id", id);
  if (error) throw error;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}
