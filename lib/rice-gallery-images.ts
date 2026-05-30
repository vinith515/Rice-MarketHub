/** User-provided hero rice photography — single image only (no slideshow) */

export type RiceImageCategory = "basmati_raw";

export type HeroTextTheme = "light" | "dark";

export type RiceGalleryImage = {
  id: string;
  src: string;
  thumb: string;
  alt: string;
  category: RiceImageCategory;
  heroTextTheme: HeroTextTheme;
};

/** Rice-only photo — not a UI screenshot */
const HERO_SRC = "/rice/01-basmati-raw-bowl.png";

/** Fixed homepage hero + site-wide backdrop */
export const HERO_RICE_IMAGE: RiceGalleryImage = {
  id: "hero-rice-background",
  src: HERO_SRC,
  thumb: HERO_SRC,
  alt: "Premium basmati rice grains",
  category: "basmati_raw",
  heroTextTheme: "light",
};

/** @deprecated Use HERO_RICE_IMAGE — kept for imports that expect an array */
export const HERO_RICE_IMAGES = [HERO_RICE_IMAGE] as const;

export const RICE_SLIDESHOW_IMAGES = [HERO_RICE_IMAGE];

export const RICE_GALLERY_IMAGES = [HERO_RICE_IMAGE];
