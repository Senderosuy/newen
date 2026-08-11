-- Delete existing placeholder slides
DELETE FROM public.carousel_slides;

-- Insert new professional slides
INSERT INTO public.carousel_slides (title, subtitle, image_url, sort_order)
VALUES 
('NEWEN — Tu Socio en el Camino', 'Traslados ejecutivos y corporativos con el máximo confort.', 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/flota-noche.jpg', 1),
('Experiencias de Turismo Premium', 'Recorré Uruguay y la región con nuestra flota de última generación.', 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-atardecer.jpg', 2),
('Llegá a tu Evento con Estilo', 'Mercedes-Benz Sprinter y Renault Master para grupos exigentes.', 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-casino.jpg', 3),
('Compromiso y Puntualidad', 'Servicio chárter y traslados de personal con seguridad garantizada.', 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-frente.jpg', 4),
('Confort en Cada Kilómetro', 'Vehículos equipados para que tu viaje sea parte del destino.', 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-hotel.jpg', 5);
