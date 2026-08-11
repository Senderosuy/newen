-- Update Sprinter Negra (Mercedes-Benz Sprinter 515 Extralarga) with official photos
UPDATE public.fleet
SET images = ARRAY[
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-campo-atardecer.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-casino-carrasco.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-frente.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-frente-puerta-abierta.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-hotel-carrasco.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-interior-butacas.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-interior-detalles.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-lateral-puerta-abierta.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-escalon-electrico.jpg',
  'https://mknhcciovwphpzeeetjt.supabase.co/storage/v1/object/public/lovable-assets/sprinter-trasera-lateral.jpg'
]
WHERE name ILIKE '%Sprinter%Negra%' OR name ILIKE '%Sprinter%Extralarga%';
