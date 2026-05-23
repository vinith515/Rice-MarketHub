-- Public read for marketing uploads (run once in Supabase SQL editor if images 403 on live site)

DROP POLICY IF EXISTS "Public read product-images" ON storage.objects;
CREATE POLICY "Public read product-images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

DROP POLICY IF EXISTS "Public read gallery" ON storage.objects;
CREATE POLICY "Public read gallery"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'gallery');
