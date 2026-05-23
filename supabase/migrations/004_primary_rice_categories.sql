-- Three primary rice types for catalog + reassign legacy categories

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Sona Masoori', 'sona-masoori', 'Daily-use sona masoori and steam rice from multiple brands', 3)
ON CONFLICT (slug) DO UPDATE SET
  name = EXCLUDED.name,
  description = EXCLUDED.description,
  sort_order = EXCLUDED.sort_order;

UPDATE categories SET
  name = 'Basmati',
  description = 'Long-grain basmati — aged, premium, and export varieties from all brands',
  sort_order = 1
WHERE slug = 'basmati';

UPDATE categories SET
  name = 'HMT Sona Masoori',
  description = 'HMT and HMT-style sona masoori for Telangana wholesale',
  sort_order = 2
WHERE slug = 'hmt-sona-masoori';

-- Move products from deprecated category slugs into primary types
UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'basmati' LIMIT 1)
WHERE category_id IN (SELECT id FROM categories WHERE slug IN ('premium', 'hotel-special'));

UPDATE products SET category_id = (SELECT id FROM categories WHERE slug = 'sona-masoori' LIMIT 1)
WHERE category_id IN (SELECT id FROM categories WHERE slug = 'daily-use');
