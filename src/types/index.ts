export interface CarouselSlide {
  id: string;
  image_url: string;
  title: string;
  subtitle: string;
  sort_order: number | null;
}

export interface Service {
  id: string;
  icon: string;
  title: string;
  description: string;
  sort_order: number | null;
}

export interface FleetVehicle {
  id: string;
  name: string;
  capacity: number;
  features: any; // Using any for JSONB
  images: string[];
  description: string | null;
  sort_order: number | null;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  cover_url: string | null;
  content: string;
  excerpt: string | null;
  published_at: string | null;
  status: string;
}

export interface SiteSettings {
  id: string;
  whatsapp_number: string | null;
  phone: string | null;
  email: string | null;
  instagram: string | null;
  facebook: string | null;
  coverage_area: string | null;
}
