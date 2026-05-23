-- Storage buckets setup (run in Supabase dashboard or SQL editor)
-- Create buckets: product-images, product-models, gallery, site-media (public read)

-- Example policies (adjust bucket names as created):
-- INSERT INTO storage.buckets (id, name, public) VALUES
--   ('product-images', 'product-images', true),
--   ('product-models', 'product-models', true),
--   ('gallery', 'gallery', true),
--   ('site-media', 'site-media', true);

-- Public read for marketing assets
-- CREATE POLICY "Public read product images" ON storage.objects
--   FOR SELECT USING (bucket_id = 'product-images');
-- Admin upload requires authenticated user with is_admin()
