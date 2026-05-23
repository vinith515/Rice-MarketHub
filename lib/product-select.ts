/** Public product query — excludes admin-only stock_quintals */
export const PRODUCT_PUBLIC_SELECT = `
  id, slug, name, category_id, brand_id, description, featured, published,
  availability_status, sort_order, external_id, created_at, price_per_kg,
  category:categories(*), brand:brands(*),
  images:product_images(*),
  package_sizes:product_package_sizes(*),
  asset_3d:product_3d_assets(*)
`;

/** Admin product query — includes stock */
export const PRODUCT_ADMIN_SELECT = `
  id, slug, name, category_id, brand_id, description, featured, published,
  availability_status, sort_order, external_id, created_at, price_per_kg, stock_quintals,
  category:categories(*), brand:brands(*),
  images:product_images(*),
  package_sizes:product_package_sizes(*),
  asset_3d:product_3d_assets(*)
`;
