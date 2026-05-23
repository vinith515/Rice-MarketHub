-- Price per kg (public), stock in quintals (admin only), enquiry quantity options

ALTER TABLE products
  ADD COLUMN IF NOT EXISTS price_per_kg NUMERIC(10, 2),
  ADD COLUMN IF NOT EXISTS stock_quintals NUMERIC(10, 2) DEFAULT 0 NOT NULL;

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS quantity_unit TEXT CHECK (quantity_unit IN ('quintals', 'bags')),
  ADD COLUMN IF NOT EXISTS quantity_value NUMERIC(10, 2);

COMMENT ON COLUMN products.stock_quintals IS 'Admin-only inventory; not exposed on public site';
COMMENT ON COLUMN products.price_per_kg IS 'Wholesale indicative price per kg in INR';
