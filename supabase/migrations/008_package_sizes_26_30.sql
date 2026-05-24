-- Allow 26 kg and 30 kg pack sizes (in addition to 5, 10, 25, 50)
ALTER TABLE product_package_sizes
  DROP CONSTRAINT IF EXISTS product_package_sizes_size_kg_check;

ALTER TABLE product_package_sizes
  ADD CONSTRAINT product_package_sizes_size_kg_check
  CHECK (size_kg IN (5, 10, 25, 26, 30, 50));
