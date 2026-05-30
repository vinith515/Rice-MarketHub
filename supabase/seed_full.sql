-- Full seed for Rice Platform (run after initial_schema)

INSERT INTO brands (name, type, priority) VALUES
  ('Telangana Premium Rice', 'own', 1),
  ('India Gate', 'external', 2);

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Basmati', 'basmati', 'Long-grain basmati from all brands', 1),
  ('HMT Sona Masoori', 'hmt-sona-masoori', 'HMT and HMT-style sona masoori', 2),
  ('Sona Masoori', 'sona-masoori', 'Sona masoori and steam rice varieties', 3)
ON CONFLICT (slug) DO NOTHING;

INSERT INTO districts (code, display_name) VALUES
  ('hyderabad', 'Hyderabad'),
  ('ranga_reddy', 'Ranga Reddy'),
  ('medchal', 'Medchal-Malkajgiri'),
  ('sangareddy', 'Sangareddy'),
  ('nizamabad', 'Nizamabad'),
  ('karimnagar', 'Karimnagar'),
  ('warangal', 'Warangal'),
  ('hanumakonda', 'Hanumakonda'),
  ('khammam', 'Khammam'),
  ('nalgonda', 'Nalgonda'),
  ('mahbubnagar', 'Mahbubnagar'),
  ('adilabad', 'Adilabad'),
  ('kamareddy', 'Kamareddy'),
  ('jagtial', 'Jagtial'),
  ('peddapalli', 'Peddapalli'),
  ('rajanna', 'Rajanna Sircilla'),
  ('jayashankar', 'Jayashankar Bhupalpally'),
  ('bhadradri', 'Bhadradri Kothagudem'),
  ('suryapet', 'Suryapet'),
  ('yadadri', 'Yadadri Bhuvanagiri'),
  ('vikarabad', 'Vikarabad'),
  ('medak', 'Medak'),
  ('siddipet', 'Siddipet'),
  ('jangaon', 'Jangaon'),
  ('mulugu', 'Mulugu'),
  ('nagarkurnool', 'Nagarkurnool'),
  ('wanaparthy', 'Wanaparthy'),
  ('jogulamba', 'Jogulamba Gadwal'),
  ('komaram_bheem', 'Komaram Bheem'),
  ('mancherial', 'Mancherial'),
  ('nirmal', 'Nirmal'),
  ('asifabad', 'Kumuram Bheem Asifabad'),
  ('narayanpet', 'Narayanpet');

INSERT INTO district_coverage (district_id, is_served, delivery_available, notes)
SELECT id, true, row_number() OVER (ORDER BY code) <= 12, 
  CASE WHEN row_number() OVER (ORDER BY code) <= 12 THEN 'Regular delivery' ELSE 'On request' END
FROM districts;

INSERT INTO site_content (key, value) VALUES
  ('hero', '{"headline":"Best Quality Rice at Wholesale Prices","subheadline":"Premium Basmati & HMT, Sona Masoori","tagline":"Bulk Supply for Retailers & Hotels","cta_primary":"View Products","cta_secondary":"Enquire on WhatsApp"}'::jsonb),
  ('stats', '{"years":"25+","clients":"500+","districts":"33","tonnes":"10,000+"}'::jsonb),
  ('about', '{"heritage":"A family-owned rice distribution business built on trust, quality, and relationships across Telangana.","warehouse":"State-of-the-art warehousing with climate-controlled storage ensuring grain freshness.","quality":"Rigorous quality checks at sourcing, processing, and dispatch for every batch.","supply_chain":"Direct relationships with mills and logistics partners for reliable bulk supply."}'::jsonb);

INSERT INTO testimonials (quote, author, business_type, featured, sort_order) VALUES
  ('Consistent quality and on-time bulk delivery for our hotel kitchens across Hyderabad.', 'Grand Palace Hotel', 'hotel', true, 1),
  ('Our supermarket chain trusts their HMT Sona Masoori supply — excellent packaging and pricing.', 'Sri Lakshmi Retail Group', 'supermarket', true, 2),
  ('15+ years of reliable rice supply for our mess operations. WhatsApp ordering makes it effortless.', 'Vignan Mess Services', 'mess', true, 3);

INSERT INTO gallery_items (category, image_url, caption, sort_order) VALUES
  ('warehouse', 'https://images.unsplash.com/photo-1586528116311-48aef45b403b?w=800&q=80', 'Modern warehouse facility', 1),
  ('rice', 'https://images.unsplash.com/photo-1536304996331-b65a78646b62?w=800&q=80', 'Premium grain closeup', 2),
  ('packaging', 'https://images.unsplash.com/photo-1604329765888-8f455b55b1d4?w=800&q=80', 'Bulk packaging line', 3),
  ('transport', 'https://images.unsplash.com/photo-1519003726774-4860bc2b9606?w=800&q=80', 'Distribution fleet', 4),
  ('hotel', 'https://images.unsplash.com/photo-1516684660595-48ed8a0b4c1e?w=800&q=80', 'Hotel supply delivery', 5),
  ('retailer', 'https://images.unsplash.com/photo-1574323346607-2a5d6d6b1e3e?w=800&q=80', 'Retailer bulk supply', 6);

-- Products
INSERT INTO products (slug, name, category_id, brand_id, description, featured, published, availability_status, sort_order)
SELECT 'premium-basmati-classic', 'Premium Basmati Classic', c.id, b.id,
  'Aged premium basmati with exceptional aroma and elongation. Ideal for hotels, caterers, and premium retail.',
  true, true, 'in_stock', 1
FROM categories c, brands b WHERE c.slug = 'basmati' AND b.name = 'Telangana Premium Rice';

INSERT INTO products (slug, name, category_id, brand_id, description, featured, published, availability_status, sort_order)
SELECT 'hmt-sona-masoori-select', 'HMT Sona Masoori Select', c.id, b.id,
  'Authentic HMT Sona Masoori sourced for Telangana wholesale. Perfect for mess, hotels, and supermarkets.',
  true, true, 'in_stock', 2
FROM categories c, brands b WHERE c.slug = 'hmt-sona-masoori' AND b.name = 'Telangana Premium Rice';

INSERT INTO products (slug, name, category_id, brand_id, description, featured, published, availability_status, sort_order)
SELECT 'hotel-special-biryani-rice', 'Hotel Special Biryani Rice', c.id, b.id,
  'Extra-long grain rice engineered for biryani service. Trusted by leading Hyderabad hotels.',
  true, true, 'limited', 3
FROM categories c, brands b WHERE c.slug = 'hotel-special' AND b.name = 'Telangana Premium Rice';

INSERT INTO products (slug, name, category_id, brand_id, description, featured, published, availability_status, sort_order)
SELECT 'daily-use-sona-masoori', 'Daily Use Sona Masoori', c.id, b.id,
  'High-volume daily rice for retailers and distributors across Telangana.',
  false, true, 'in_stock', 4
FROM categories c, brands b WHERE c.slug = 'daily-use' AND b.name = 'India Gate';

INSERT INTO products (slug, name, category_id, brand_id, description, featured, published, availability_status, sort_order)
SELECT 'export-premium-basmati', 'Export Premium Basmati', c.id, b.id,
  'Export-grade basmati with superior polish and consistency for premium buyers.',
  true, true, 'in_stock', 5
FROM categories c, brands b WHERE c.slug = 'premium' AND b.name = 'Telangana Premium Rice';

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1586200079224-1c4a4a4a4a4a?w=800&q=80', p.name, 0
FROM products p WHERE p.slug = 'premium-basmati-classic';

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1536304996331-b65a78646b62?w=800&q=80', p.name, 0
FROM products p WHERE p.slug = 'hmt-sona-masoori-select';

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1516684660595-48ed8a0b4c1e?w=800&q=80', p.name, 0
FROM products p WHERE p.slug = 'hotel-special-biryani-rice';

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1574323346607-2a5d6d6b1e3e?w=800&q=80', p.name, 0
FROM products p WHERE p.slug = 'daily-use-sona-masoori';

INSERT INTO product_images (product_id, url, alt, sort_order)
SELECT p.id, 'https://images.unsplash.com/photo-1604329765888-8f455b55b1d4?w=800&q=80', p.name, 0
FROM products p WHERE p.slug = 'export-premium-basmati';

INSERT INTO product_package_sizes (product_id, size_kg, available)
SELECT p.id, s.size_kg, true FROM products p
CROSS JOIN (VALUES (5),(10),(25),(50)) AS s(size_kg)
WHERE p.slug IN ('premium-basmati-classic', 'export-premium-basmati');

INSERT INTO product_package_sizes (product_id, size_kg, available)
SELECT p.id, s.size_kg, true FROM products p
CROSS JOIN (VALUES (10),(25),(50)) AS s(size_kg)
WHERE p.slug = 'hmt-sona-masoori-select';

INSERT INTO product_package_sizes (product_id, size_kg, available)
SELECT p.id, s.size_kg, true FROM products p
CROSS JOIN (VALUES (25),(50)) AS s(size_kg)
WHERE p.slug = 'hotel-special-biryani-rice';

INSERT INTO product_package_sizes (product_id, size_kg, available)
SELECT p.id, s.size_kg, true FROM products p
CROSS JOIN (VALUES (5),(25),(50)) AS s(size_kg)
WHERE p.slug = 'daily-use-sona-masoori';
