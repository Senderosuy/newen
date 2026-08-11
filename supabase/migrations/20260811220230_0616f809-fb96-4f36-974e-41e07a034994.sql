-- Lectura pública para el bucket site-photos (incluso si es privado, forzamos lectura pública vía RLS)
-- Nota: El bucket se creó como privado por política del workspace, pero habilitamos SELECT para todos (anon).
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND policyname = 'Public read site-photos') THEN
    CREATE POLICY "Public read site-photos" ON storage.objects
      FOR SELECT USING (bucket_id = 'site-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND policyname = 'Auth insert site-photos') THEN
    CREATE POLICY "Auth insert site-photos" ON storage.objects
      FOR INSERT TO authenticated WITH CHECK (bucket_id = 'site-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND policyname = 'Auth update site-photos') THEN
    CREATE POLICY "Auth update site-photos" ON storage.objects
      FOR UPDATE TO authenticated USING (bucket_id = 'site-photos');
  END IF;
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE schemaname = 'storage' AND policyname = 'Auth delete site-photos') THEN
    CREATE POLICY "Auth delete site-photos" ON storage.objects
      FOR DELETE TO authenticated USING (bucket_id = 'site-photos');
  END IF;
END $$;