/** User-provided rice photography — /public/rice (6 images only) */

export type RiceImageCategory =
  | "basmati_raw"
  | "basmati_cooked"
  | "harvest"
  | "wholesale"
  | "field"
  | "quality";

/** "light" = cream/white text on dark overlay; "dark" = charcoal text on cream panel */
export type HeroTextTheme = "light" | "dark";

export type RiceGalleryImage = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  category: RiceImageCategory;
  heroTextTheme: HeroTextTheme;
};

function local(file: string): string {
  return `/rice/${file}`;
}

/** Single source of truth — used for hero, site backdrop, and demo gallery */
export const RICE_SLIDESHOW_IMAGES: RiceGalleryImage[] = [
  {
    id: "basmati-raw-bowl",
    src: local("01-basmati-raw-bowl.png"),
    thumb: local("01-basmati-raw-bowl.png"),
    alt: "Premium basmati grains in a bowl",
    category: "basmati_raw",
    heroTextTheme: "light",
  },
  {
    id: "cooked-basmati",
    src: local("02-cooked-basmati.png"),
    thumb: local("02-cooked-basmati.png"),
    alt: "Fluffy cooked basmati with fresh herbs",
    category: "basmati_cooked",
    heroTextTheme: "dark",
  },
  {
    id: "harvest-paddy",
    src: local("03-harvest-paddy.png"),
    thumb: local("03-harvest-paddy.png"),
    alt: "Golden paddy harvest in the field",
    category: "harvest",
    heroTextTheme: "dark",
  },
  {
    id: "burlap-sack",
    src: local("04-burlap-sack-rice.png"),
    thumb: local("04-burlap-sack-rice.png"),
    alt: "Basmati rice from burlap sack and scoop",
    category: "wholesale",
    heroTextTheme: "dark",
  },
  {
    id: "paddy-field",
    src: local("05-paddy-field.png"),
    thumb: local("05-paddy-field.png"),
    alt: "Farmers planting rice in the paddy",
    category: "field",
    heroTextTheme: "light",
  },
  {
    id: "quality-warehouse",
    src: local("06-quality-warehouse.png"),
    thumb: local("06-quality-warehouse.png"),
    alt: "Quality control at the rice mill",
    category: "quality",
    heroTextTheme: "dark",
  },
];

export const RICE_GALLERY_IMAGES = RICE_SLIDESHOW_IMAGES;
export const HERO_RICE_IMAGES = RICE_SLIDESHOW_IMAGES;
