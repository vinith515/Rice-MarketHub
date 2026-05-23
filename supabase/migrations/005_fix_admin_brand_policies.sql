-- Fix brand (and related) admin write policies: explicit INSERT/UPDATE/DELETE with WITH CHECK

DROP POLICY IF EXISTS "Admin all brands" ON brands;

CREATE POLICY "brands_admin_insert" ON brands
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "brands_admin_update" ON brands
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "brands_admin_delete" ON brands
  FOR DELETE TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin all products" ON products;

CREATE POLICY "products_admin_insert" ON products
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "products_admin_update" ON products
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "products_admin_delete" ON products
  FOR DELETE TO authenticated
  USING (is_admin());

DROP POLICY IF EXISTS "Admin all package sizes" ON product_package_sizes;

CREATE POLICY "package_sizes_admin_insert" ON product_package_sizes
  FOR INSERT TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "package_sizes_admin_update" ON product_package_sizes
  FOR UPDATE TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

CREATE POLICY "package_sizes_admin_delete" ON product_package_sizes
  FOR DELETE TO authenticated
  USING (is_admin());
