-- Returning visitors: profile + per-visit intent
CREATE TABLE site_visitors (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contact_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  phone_normalized TEXT NOT NULL UNIQUE,
  business_type TEXT NOT NULL,
  district_id UUID REFERENCES districts(id) ON DELETE SET NULL,
  place_name TEXT,
  email TEXT,
  last_seen_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE visitor_intents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  visitor_id UUID NOT NULL REFERENCES site_visitors(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE SET NULL,
  message TEXT,
  quantity_unit TEXT CHECK (quantity_unit IN ('quintals', 'bags')),
  quantity_value NUMERIC(10, 2),
  package_size_kg INT,
  source TEXT NOT NULL DEFAULT 'quick_intent'
    CHECK (source IN ('onboarding', 'quick_intent', 'whatsapp', 'form')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE enquiries
  ADD COLUMN IF NOT EXISTS visitor_id UUID REFERENCES site_visitors(id) ON DELETE SET NULL;

ALTER TABLE enquiries DROP CONSTRAINT IF EXISTS enquiries_source_check;
ALTER TABLE enquiries ADD CONSTRAINT enquiries_source_check
  CHECK (source IN ('form', 'whatsapp_click', 'visitor_intent'));

ALTER TABLE site_visitors ENABLE ROW LEVEL SECURITY;
ALTER TABLE visitor_intents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public insert site_visitors" ON site_visitors
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Public update site_visitors" ON site_visitors
  FOR UPDATE USING (true) WITH CHECK (true);

CREATE POLICY "Public insert visitor_intents" ON visitor_intents
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Admin all site_visitors" ON site_visitors
  FOR ALL USING (is_admin());

CREATE POLICY "Admin all visitor_intents" ON visitor_intents
  FOR ALL USING (is_admin());

-- Phone lookup without exposing all rows to anon clients
CREATE OR REPLACE FUNCTION get_site_visitor_by_phone(p_phone_normalized text)
RETURNS SETOF site_visitors
LANGUAGE sql
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT * FROM site_visitors
  WHERE phone_normalized = p_phone_normalized
  LIMIT 1;
$$;

GRANT EXECUTE ON FUNCTION get_site_visitor_by_phone(text) TO anon, authenticated;
