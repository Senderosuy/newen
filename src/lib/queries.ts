import { supabase } from "@/integrations/supabase/client";

export const getCarouselSlides = async () => {
  const { data, error } = await supabase
    .from("carousel_slides")
    .select("*")
    .order("sort_order", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getServices = async () => {
  const { data, error } = await supabase
    .from("services")
    .select("*")
    .order("sort_order", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getFleet = async () => {
  const { data, error } = await supabase
    .from("fleet")
    .select("*")
    .order("sort_order", { ascending: true });
  
  if (error) throw error;
  return data;
};

export const getBlogPosts = async () => {
  const { data, error } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("status", "published")
    .order("published_at", { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getSiteSettings = async () => {
  const { data, error } = await supabase
    .from("site_settings")
    .select("*")
    .single();
  
  if (error) throw error;
  return data;
};
