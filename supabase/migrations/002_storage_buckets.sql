-- Storage buckets for media uploads (applied to hosted project)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types) VALUES
  ('product-images', 'product-images', true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('product-models', 'product-models', true, 20971520, ARRAY['model/gltf-binary','application/octet-stream']),
  ('gallery', 'gallery', true, 5242880, ARRAY['image/jpeg','image/png','image/webp']),
  ('site-media', 'site-media', true, 10485760, ARRAY['image/jpeg','image/png','image/webp','video/mp4'])
ON CONFLICT (id) DO NOTHING;
