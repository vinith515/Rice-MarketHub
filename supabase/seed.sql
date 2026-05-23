-- Seed data for Premium B2B Rice Distribution
-- Run after 001_initial_schema.sql

INSERT INTO brands (name, type, priority) VALUES
  ('Telangana Premium Rice', 'own', 1),
  ('India Gate', 'external', 2);

INSERT INTO categories (name, slug, description, sort_order) VALUES
  ('Basmati Rice', 'basmati', 'Premium long-grain basmati', 1),
  ('HMT Sona Masoori', 'hmt-sona-masoori', 'Trusted daily rice', 2),
  ('Premium Rice', 'premium', 'Export-quality selection', 3),
  ('Hotel Special Rice', 'hotel-special', 'Hospitality bulk supply', 4),
  ('Daily Use Rice', 'daily-use', 'High-volume daily rice', 5);

INSERT INTO districts (code, display_name) VALUES
  ('hyderabad', 'Hyderabad'),
  ('ranga_reddy', 'Ranga Reddy'),
  ('warangal', 'Warangal'),
  ('karimnagar', 'Karimnagar'),
  ('nizamabad', 'Nizamabad'),
  ('khammam', 'Khammam'),
  ('nalgonda', 'Nalgonda'),
  ('medak', 'Medak');

INSERT INTO site_content (key, value) VALUES
  ('hero', '{"headline":"Trusted Rice Distribution Across Telangana","subheadline":"Premium Basmati & HMT Sona Masoori","tagline":"Bulk Supply for Retailers & Hotels"}'),
  ('stats', '{"years":"25+","clients":"500+","districts":"33","tonnes":"10,000+"}'),
  ('about', '{"heritage":"Family-owned rice distribution built on trust across Telangana.","warehouse":"Climate-controlled warehousing.","quality":"Rigorous quality checks at every stage.","supply_chain":"Direct mill and logistics partnerships."}');

INSERT INTO testimonials (quote, author, business_type, featured, sort_order) VALUES
  ('Consistent quality and on-time bulk delivery for our hotel kitchens.', 'Grand Palace Hotel', 'hotel', true, 1),
  ('Our supermarket chain trusts their HMT Sona Masoori supply.', 'Sri Lakshmi Retail Group', 'supermarket', true, 2),
  ('15+ years of reliable rice supply for our mess operations.', 'Vignan Mess Services', 'mess', true, 3);
