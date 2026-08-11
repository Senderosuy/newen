-- Create carousel_slides table
CREATE TABLE public.carousel_slides (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url TEXT NOT NULL,
    title TEXT NOT NULL,
    subtitle TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create services table
CREATE TABLE public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    icon TEXT NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INTEGER DEFAULT 0
);

-- Create fleet table
CREATE TABLE public.fleet (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    capacity INTEGER NOT NULL,
    features JSONB NOT NULL DEFAULT '[]',
    images TEXT[] NOT NULL DEFAULT '{}',
    description TEXT,
    sort_order INTEGER DEFAULT 0
);

-- Create blog_posts table
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    cover_url TEXT,
    content TEXT NOT NULL,
    excerpt TEXT,
    published_at TIMESTAMPTZ,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published')),
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Create site_settings table
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    whatsapp_number TEXT DEFAULT '+59899738955',
    phone TEXT,
    email TEXT,
    instagram TEXT,
    facebook TEXT,
    coverage_area TEXT,
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.carousel_slides ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.fleet ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Grants
GRANT SELECT ON public.carousel_slides TO anon, authenticated;
GRANT ALL ON public.carousel_slides TO service_role;
GRANT ALL ON public.carousel_slides TO authenticated;

GRANT SELECT ON public.services TO anon, authenticated;
GRANT ALL ON public.services TO service_role;
GRANT ALL ON public.services TO authenticated;

GRANT SELECT ON public.fleet TO anon, authenticated;
GRANT ALL ON public.fleet TO service_role;
GRANT ALL ON public.fleet TO authenticated;

GRANT SELECT ON public.blog_posts TO anon, authenticated;
GRANT ALL ON public.blog_posts TO service_role;
GRANT ALL ON public.blog_posts TO authenticated;

GRANT SELECT ON public.site_settings TO anon, authenticated;
GRANT ALL ON public.site_settings TO service_role;
GRANT ALL ON public.site_settings TO authenticated;

-- Policies
CREATE POLICY "Public read carousel_slides" ON public.carousel_slides FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin CRUD carousel_slides" ON public.carousel_slides FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read services" ON public.services FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin CRUD services" ON public.services FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read fleet" ON public.fleet FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin CRUD fleet" ON public.fleet FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read blog_posts" ON public.blog_posts FOR SELECT TO anon, authenticated USING (status = 'published');
CREATE POLICY "Admin CRUD blog_posts" ON public.blog_posts FOR ALL TO authenticated USING (true);

CREATE POLICY "Public read site_settings" ON public.site_settings FOR SELECT TO anon, authenticated USING (true);
CREATE POLICY "Admin CRUD site_settings" ON public.site_settings FOR ALL TO authenticated USING (true);

-- Insert Initial Content
INSERT INTO public.site_settings (whatsapp_number, phone, email, instagram, coverage_area)
VALUES ('+59899738955', '+598 99 738 955', 'contacto@newen.com.uy', '@newen.uy', 'Uruguay y región');

INSERT INTO public.services (icon, title, description, sort_order)
VALUES 
('MapPin', 'Turismo y Larga Distancia', 'Viajes grupales, excursiones y traslados a cualquier punto del país.', 1),
('Briefcase', 'Transfers Ejecutivos', 'Traslados corporativos, aeropuertos y eventos empresariales.', 2),
('Users', 'Eventos Sociales', 'Casamientos, cumpleaños, egresados y salidas grupales.', 3),
('Calendar', 'Servicios Chárter', 'Contrataciones por jornada o recorridos personalizados.', 4);

INSERT INTO public.fleet (name, capacity, features, description, sort_order)
VALUES 
('Mercedes-Benz Sprinter 515 Extralarga (Negra)', 17, '["Puerta lateral con escalón eléctrico", "Claraboya panorámica", "Luces de lectura individuales", "Aire acondicionado", "Portapaquetes", "Conservadora/heladera a bordo", "Cinturones de seguridad"]'::jsonb, 'Ideal para transfers ejecutivos, turismo y larga distancia.', 1),
('Renault Master (Blanca)', 15, '["Butacas cómodas", "Aire acondicionado", "Agarraderas de seguridad"]'::jsonb, 'Ideal para grupos medianos, eventos y traslados urbanos.', 2),
('Mercedes-Benz Sprinter 515 (Blanca)', 17, '["Aire acondicionado", "Luces de lectura", "Cinturones de seguridad"]'::jsonb, 'Confort y seguridad característicos de la línea Sprinter.', 3);
