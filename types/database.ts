export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Brand = {
  id: string;
  name: string;
  type: "own" | "external";
  logo_url: string | null;
  priority: number;
  created_at: string;
};

export type Category = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  sort_order: number;
};

export type Product = {
  id: string;
  slug: string;
  name: string;
  category_id: string;
  brand_id: string | null;
  description: string;
  featured: boolean;
  published: boolean;
  availability_status: "in_stock" | "limited" | "out_of_stock";
  sort_order: number;
  external_id: string | null;
  price_per_kg: number | null;
  /** Admin-only — never show on public site */
  stock_quintals?: number | null;
  created_at: string;
  category?: Category;
  brand?: Brand;
  images?: ProductImage[];
  package_sizes?: ProductPackageSize[];
  asset_3d?: Product3DAsset | null;
};

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
};

export type ProductPackageSize = {
  id: string;
  product_id: string;
  size_kg: number;
  available: boolean;
};

export type Product3DAsset = {
  id: string;
  product_id: string;
  glb_url: string | null;
  poster_url: string | null;
  video_url?: string | null;
};

export type District = {
  id: string;
  code: string;
  display_name: string;
};

export type DistrictCoverage = {
  id: string;
  district_id: string;
  is_served: boolean;
  delivery_available: boolean;
  notes: string | null;
  district?: District;
};

export type Enquiry = {
  id: string;
  source: "form" | "whatsapp_click";
  business_type: string;
  contact_name: string;
  phone: string;
  email: string | null;
  district_id: string | null;
  product_id: string | null;
  package_size_kg: number | null;
  quantity_unit: "quintals" | "bags" | null;
  quantity_value: number | null;
  message: string;
  status: "new" | "contacted" | "quoted" | "closed";
  metadata: Json;
  created_at: string;
  product?: Product;
  district?: District;
};

export type Testimonial = {
  id: string;
  quote: string;
  author: string;
  business_type: string;
  featured: boolean;
  sort_order: number;
};

export type GalleryItem = {
  id: string;
  category: string;
  image_url: string;
  caption: string | null;
  sort_order: number;
};

export type SiteContent = {
  id: string;
  key: string;
  value: Json;
  updated_at: string;
};

export type AnalyticsEvent = {
  id: string;
  event_type: string;
  path: string | null;
  product_id: string | null;
  district_id: string | null;
  session_id: string | null;
  metadata: Json;
  created_at: string;
};

export type Profile = {
  id: string;
  role: "admin";
  full_name: string | null;
};
