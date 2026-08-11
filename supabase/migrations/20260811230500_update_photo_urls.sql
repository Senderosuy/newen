-- Apuntar carrusel y flota a las fotos definitivas del bucket propio site-photos.
-- Las fotos se suben con scripts/upload-photos.mjs (rutas deterministas).

-- Carrusel (por sort_order)
UPDATE public.carousel_slides SET image_url = 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/carousel/flota-completa-noche.jpg' WHERE sort_order = 1;
UPDATE public.carousel_slides SET image_url = 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/carousel/sprinter-campo-atardecer.jpg' WHERE sort_order = 2;
UPDATE public.carousel_slides SET image_url = 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/carousel/sprinter-casino-carrasco-noche.jpg' WHERE sort_order = 3;
UPDATE public.carousel_slides SET image_url = 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/carousel/sprinter-frente.jpg' WHERE sort_order = 4;
UPDATE public.carousel_slides SET image_url = 'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/carousel/sprinter-hotel-carrasco-noche.jpg' WHERE sort_order = 5;

-- Sprinter 515 Extralarga (negra)
UPDATE public.fleet SET images = ARRAY[
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-frente.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-campo-atardecer.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-casino-carrasco-noche.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-hotel-carrasco-noche.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-frente-puerta-abierta.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-lateral-puerta-abierta.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-puerta-escalon-electrico.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-interior-butacas.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-interior-claraboya-luces.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-negra/sprinter-trasera-lateral.jpg'
]
WHERE name ILIKE '%Sprinter%Extralarga%' OR name ILIKE '%Sprinter%Negra%';

-- Renault Master (blanca)
UPDATE public.fleet SET images = ARRAY[
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/renault-master/master-junto-a-flota-noche.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/renault-master/master-interior-butacas.jpg'
]
WHERE name ILIKE '%Renault%Master%';

-- Sprinter 515 (blanca)
UPDATE public.fleet SET images = ARRAY[
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-01.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-02.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-03.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-04.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-05.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-06.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-07.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-08.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-09.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-10.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-11.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-12.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-13.jpeg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/site-photos/fleet/sprinter-blanca/sprinter-blanca-14.jpeg'
]
WHERE name ILIKE '%Sprinter%Blanca%';
