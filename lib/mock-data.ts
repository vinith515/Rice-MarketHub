import { TELANGANA_DISTRICTS } from "@/lib/constants";
import type {
  Brand,
  Category,
  District,
  DistrictCoverage,
  Enquiry,
  GalleryItem,
  Product,
  SiteContent,
  Testimonial,
} from "@/types/database";

const now = new Date().toISOString();

export const MOCK_BRANDS: Brand[] = [
  {
    id: "b1",
    name: "Telangana Premium Rice",
    type: "own",
    logo_url: null,
    priority: 1,
    created_at: now,
  },
  {
    id: "b2",
    name: "India Gate",
    type: "external",
    logo_url: null,
    priority: 2,
    created_at: now,
  },
  {
    id: "b3",
    name: "Kohinoor",
    type: "external",
    logo_url: null,
    priority: 3,
    created_at: now,
  },
  {
    id: "b4",
    name: "Sri Sri Tattva",
    type: "external",
    logo_url: null,
    priority: 4,
    created_at: now,
  },
  {
    id: "b5",
    name: "Kranti",
    type: "external",
    logo_url: null,
    priority: 5,
    created_at: now,
  },
];

export const MOCK_CATEGORIES: Category[] = [
  {
    id: "c1",
    name: "Basmati",
    slug: "basmati",
    description:
      "Long-grain basmati — aged, premium, and export varieties from all brands",
    sort_order: 1,
  },
  {
    id: "c2",
    name: "HMT Sona Masoori",
    slug: "hmt-sona-masoori",
    description:
      "HMT and HMT-style sona masoori for Telangana wholesale",
    sort_order: 2,
  },
  {
    id: "c3",
    name: "Sona Masoori",
    slug: "sona-masoori",
    description:
      "Sona masoori and steam rice — hotel, daily use, and regional brands",
    sort_order: 3,
  },
];

const LOCAL_RICE = [
  "/rice/01-basmati-raw-bowl.png",
  "/rice/02-cooked-basmati.png",
  "/rice/03-harvest-paddy.png",
  "/rice/04-burlap-sack-rice.png",
  "/rice/05-paddy-field.png",
  "/rice/06-quality-warehouse.png",
] as const;

const img = (index: number) => LOCAL_RICE[index % LOCAL_RICE.length];

export const MOCK_PRODUCTS: Product[] = [
  {
    id: "p1",
    slug: "premium-basmati-classic",
    name: "Premium Basmati Classic",
    category_id: "c1",
    brand_id: "b1",
    description:
      "Aged premium basmati with exceptional aroma and elongation. Ideal for hotels, caterers, and premium retail.",
    featured: true,
    published: true,
    availability_status: "in_stock",
    sort_order: 1,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[0],
    brand: MOCK_BRANDS[0],
    images: [
      {
        id: "i1",
        product_id: "p1",
        url: img(0),
        alt: "Premium Basmati",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps1", product_id: "p1", size_kg: 5, available: true },
      { id: "ps2", product_id: "p1", size_kg: 10, available: true },
      { id: "ps3", product_id: "p1", size_kg: 25, available: true },
      { id: "ps4", product_id: "p1", size_kg: 50, available: true },
    ],
    asset_3d: null,
  },
  {
    id: "p2",
    slug: "hmt-sona-masoori-select",
    name: "HMT Sona Masoori Select",
    category_id: "c2",
    brand_id: "b1",
    description:
      "Authentic HMT Sona Masoori sourced for Telangana wholesale. Perfect for mess, hotels, and supermarkets.",
    featured: true,
    published: true,
    availability_status: "in_stock",
    sort_order: 2,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[1],
    brand: MOCK_BRANDS[0],
    images: [
      {
        id: "i2",
        product_id: "p2",
        url: img(1),
        alt: "HMT Sona Masoori",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps5", product_id: "p2", size_kg: 10, available: true },
      { id: "ps6", product_id: "p2", size_kg: 25, available: true },
      { id: "ps7", product_id: "p2", size_kg: 50, available: true },
    ],
    asset_3d: null,
  },
  {
    id: "p3",
    slug: "hotel-special-biryani-rice",
    name: "Hotel Special Biryani Rice",
    category_id: "c1",
    brand_id: "b1",
    description:
      "Extra-long grain rice engineered for biryani service. Trusted by leading Hyderabad hotels.",
    featured: true,
    published: true,
    availability_status: "limited",
    sort_order: 3,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[0],
    brand: MOCK_BRANDS[0],
    images: [
      {
        id: "i3",
        product_id: "p3",
        url: img(2),
        alt: "Hotel Special Rice",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps8", product_id: "p3", size_kg: 25, available: true },
      { id: "ps9", product_id: "p3", size_kg: 50, available: true },
    ],
    asset_3d: null,
  },
  {
    id: "p4",
    slug: "daily-use-sona-masoori",
    name: "Daily Use Sona Masoori",
    category_id: "c3",
    brand_id: "b2",
    description: "High-volume daily rice for retailers and distributors across Telangana.",
    featured: false,
    published: true,
    availability_status: "in_stock",
    sort_order: 4,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[2],
    brand: MOCK_BRANDS[1],
    images: [
      {
        id: "i4",
        product_id: "p4",
        url: img(3),
        alt: "Daily Use Rice",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps10", product_id: "p4", size_kg: 5, available: true },
      { id: "ps11", product_id: "p4", size_kg: 25, available: true },
      { id: "ps12", product_id: "p4", size_kg: 50, available: true },
    ],
    asset_3d: null,
  },
  {
    id: "p5",
    slug: "export-premium-basmati",
    name: "Export Premium Basmati",
    category_id: "c1",
    brand_id: "b1",
    description: "Export-grade basmati with superior polish and consistency for premium buyers.",
    featured: true,
    published: true,
    availability_status: "in_stock",
    sort_order: 5,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[0],
    brand: MOCK_BRANDS[0],
    images: [
      {
        id: "i5",
        product_id: "p5",
        url: img(4),
        alt: "Export Premium Basmati",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps13", product_id: "p5", size_kg: 10, available: true },
      { id: "ps14", product_id: "p5", size_kg: 25, available: true },
      { id: "ps15", product_id: "p5", size_kg: 50, available: true },
    ],
    asset_3d: null,
  },
  {
    id: "p6",
    slug: "kohinoor-basmati-dubar",
    name: "Kohinoor Basmati Dubar",
    category_id: "c1",
    brand_id: "b3",
    description: "Popular dubar basmati for supermarkets and retail chains.",
    featured: false,
    published: true,
    availability_status: "in_stock",
    sort_order: 6,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[0],
    brand: MOCK_BRANDS[2],
    images: [
      {
        id: "i6",
        product_id: "p6",
        url: img(4),
        alt: "Kohinoor Basmati",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps16", product_id: "p6", size_kg: 5, available: true },
      { id: "ps17", product_id: "p6", size_kg: 10, available: true },
    ],
    asset_3d: null,
  },
  {
    id: "p7",
    slug: "kranti-hmt-sona-masoori",
    name: "Kranti HMT Sona Masoori",
    category_id: "c2",
    brand_id: "b5",
    description: "Kranti HMT sona masoori — high turnover for mess and canteens.",
    featured: false,
    published: true,
    availability_status: "in_stock",
    sort_order: 7,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[1],
    brand: MOCK_BRANDS[4],
    images: [
      {
        id: "i7",
        product_id: "p7",
        url: img(1),
        alt: "Kranti HMT",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps18", product_id: "p7", size_kg: 25, available: true },
      { id: "ps19", product_id: "p7", size_kg: 50, available: true },
    ],
    asset_3d: null,
  },
  {
    id: "p8",
    slug: "sri-sri-sona-masoori-steam",
    name: "Sri Sri Sona Masoori Steam",
    category_id: "c3",
    brand_id: "b4",
    description: "Steam sona masoori for daily household and retailer demand.",
    featured: false,
    published: true,
    availability_status: "in_stock",
    sort_order: 8,
    external_id: null,
    price_per_kg: 92,
    stock_quintals: 120,
    created_at: now,
    category: MOCK_CATEGORIES[2],
    brand: MOCK_BRANDS[3],
    images: [
      {
        id: "i8",
        product_id: "p8",
        url: img(3),
        alt: "Sri Sri Sona Masoori",
        sort_order: 0,
      },
    ],
    package_sizes: [
      { id: "ps20", product_id: "p8", size_kg: 10, available: true },
      { id: "ps21", product_id: "p8", size_kg: 25, available: true },
    ],
    asset_3d: null,
  },
];

export const MOCK_DISTRICTS: District[] = TELANGANA_DISTRICTS.map((d, i) => ({
  id: `d${i + 1}`,
  code: d.code,
  display_name: d.name,
}));

export const MOCK_COVERAGE: DistrictCoverage[] = MOCK_DISTRICTS.map(
  (d, i) => ({
    id: `cov-${d.id}`,
    district_id: d.id,
    is_served: i < 28,
    delivery_available: i < 12,
    notes: i < 12 ? "Regular delivery" : "On request",
    district: d,
  })
);

export const MOCK_TESTIMONIALS: Testimonial[] = [
  {
    id: "t1",
    quote:
      "Consistent quality and on-time bulk delivery for our hotel kitchens across Hyderabad.",
    author: "Grand Palace Hotel",
    business_type: "hotel",
    featured: true,
    sort_order: 1,
  },
  {
    id: "t2",
    quote:
      "Our supermarket chain trusts their HMT Sona Masoori supply — excellent packaging and pricing.",
    author: "Sri Lakshmi Retail Group",
    business_type: "supermarket",
    featured: true,
    sort_order: 2,
  },
  {
    id: "t3",
    quote:
      "15+ years of reliable rice supply for our mess operations. WhatsApp ordering makes it effortless.",
    author: "Vignan Mess Services",
    business_type: "mess",
    featured: true,
    sort_order: 3,
  },
];

export const MOCK_GALLERY: GalleryItem[] = [
  {
    id: "g1",
    category: "quality",
    image_url: LOCAL_RICE[5],
    caption: "Quality checks at the mill",
    sort_order: 1,
  },
  {
    id: "g2",
    category: "rice",
    image_url: LOCAL_RICE[0],
    caption: "Premium basmati grains",
    sort_order: 2,
  },
  {
    id: "g3",
    category: "rice",
    image_url: LOCAL_RICE[1],
    caption: "Cooked basmati — hotel service",
    sort_order: 3,
  },
  {
    id: "g4",
    category: "harvest",
    image_url: LOCAL_RICE[2],
    caption: "Golden paddy at harvest",
    sort_order: 4,
  },
  {
    id: "g5",
    category: "packaging",
    image_url: LOCAL_RICE[3],
    caption: "Wholesale sacks and bulk rice",
    sort_order: 5,
  },
  {
    id: "g6",
    category: "field",
    image_url: LOCAL_RICE[4],
    caption: "Planting in the paddy field",
    sort_order: 6,
  },
];

export const MOCK_SITE_CONTENT: SiteContent[] = [
  {
    id: "sc1",
    key: "hero",
    value: {
      headline: "Trusted Rice Distribution Across Telangana",
      subheadline: "Premium Basmati & HMT Sona Masoori",
      tagline: "Bulk Supply for Retailers & Hotels",
      cta_primary: "View Products",
      cta_secondary: "Enquire on WhatsApp",
    },
    updated_at: now,
  },
  {
    id: "sc2",
    key: "stats",
    value: {
      years: "25+",
      clients: "500+",
      districts: "33",
      tonnes: "10,000+",
    },
    updated_at: now,
  },
  {
    id: "sc-wa",
    key: "whatsapp",
    value: {
      number: "919876543210",
      group_invite_url: null,
      group_enabled: false,
      direct_label: "Enquire on WhatsApp",
      group_label: "Team WhatsApp Group",
      group_description:
        "Join our business group — multiple team members can respond to your bulk rice enquiry faster.",
    },
    updated_at: now,
  },
  {
    id: "sc3",
    key: "about",
    value: {
      heritage:
        "A family-owned rice distribution business built on trust, quality, and relationships across Telangana.",
      warehouse:
        "State-of-the-art warehousing with climate-controlled storage ensuring grain freshness.",
      quality:
        "Rigorous quality checks at sourcing, processing, and dispatch for every batch.",
      supply_chain:
        "Direct relationships with mills and logistics partners for reliable bulk supply.",
    },
    updated_at: now,
  },
];

export let MOCK_ENQUIRIES: Enquiry[] = [
  {
    id: "e1",
    source: "form",
    business_type: "hotel",
    contact_name: "Rajesh Kumar",
    phone: "9876543210",
    email: "rajesh@hotel.com",
    district_id: "d1",
    product_id: "p2",
    package_size_kg: null,
    quantity_unit: "quintals",
    quantity_value: 5,
    message: "Need HMT Sona Masoori for hotel supply weekly.",
    status: "new",
    metadata: {},
    created_at: now,
  },
];

export const MOCK_ANALYTICS = {
  visits: 1240,
  enquiries: 48,
  whatsappClicks: 156,
  topProducts: [
    { name: "HMT Sona Masoori Select", views: 420 },
    { name: "Premium Basmati Classic", views: 380 },
    { name: "Hotel Special Biryani Rice", views: 290 },
  ],
};
