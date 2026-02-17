"use client";

import type { LocalizedText } from "./i18n";
import {
  categories as fallbackCategories,
  type MenuCategory,
  type MenuItem,
  type OfferItem,
} from "./menu-data";
import { apiFetch, getApiBaseUrl } from "./api-client";

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type ApiCategory = {
  id: number;
  name_ar: string;
  name_en?: string | null;
  slug?: string | null;
  is_active?: boolean;
};

type ApiTag = {
  id: number;
  code: string;
  name_ar: string;
};

type ApiProduct = {
  id: number;
  name_ar: string;
  description_ar?: string | null;
  price: string;
  image?: string | null;
  category?: ApiCategory | null;
  tags?: ApiTag[] | null;
  is_available?: boolean;
};

type ApiOffer = {
  id: number;
  title_ar: string;
  description_ar?: string | null;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: string;
  is_active?: boolean;
};

export type MenuCatalog = {
  categories: MenuCategory[];
  items: MenuItem[];
  offers: OfferItem[];
};

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_OFFER_IMAGE =
  "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80";

const toLocalizedText = (
  arValue?: string | null,
  enValue?: string | null
): LocalizedText => ({
  ar: arValue?.trim() || "",
  en: enValue?.trim() || arValue?.trim() || "",
});

const parseNumber = (value: string | number | null | undefined) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const pickCategoryIcon = (label: string) => {
  const key = label.toLowerCase();
  if (key.includes("appet") || key.includes("starter")) return "🥗";
  if (key.includes("main") || key.includes("grill") || key.includes("meal"))
    return "🍔";
  if (key.includes("drink") || key.includes("beverage")) return "🥤";
  if (key.includes("dessert") || key.includes("sweet")) return "🍰";
  return "✦";
};

const mapCategory = (category: ApiCategory): MenuCategory => {
  const label = category.slug || category.name_en || category.name_ar || "";
  return {
    id: String(category.id),
    label: toLocalizedText(category.name_ar, category.name_en),
    icon: pickCategoryIcon(label),
  };
};

const mapProduct = (product: ApiProduct): MenuItem => {
  const label = product.name_ar || "";
  return {
    id: product.id,
    name: toLocalizedText(label, label),
    desc: toLocalizedText(product.description_ar ?? "", product.description_ar),
    price: parseNumber(product.price),
    category: product.category ? String(product.category.id) : "uncategorized",
    image: product.image || DEFAULT_PRODUCT_IMAGE,
  };
};

const mapOffer = (offer: ApiOffer): OfferItem => {
  const badge =
    offer.type === "PERCENT"
      ? `${parseNumber(offer.value)}%`
      : `-${parseNumber(offer.value)}`;
  return {
    id: offer.id,
    title: toLocalizedText(offer.title_ar, offer.title_ar),
    desc: toLocalizedText(offer.description_ar ?? "", offer.description_ar),
    price: parseNumber(offer.value),
    badge,
    image: DEFAULT_OFFER_IMAGE,
  };
};

export const fetchMenuCatalog = async (): Promise<MenuCatalog | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }

  const [categoriesResult, productsResult, offersResult] =
    await Promise.allSettled([
      apiFetch<Paginated<ApiCategory>>(
        "/api/categories/?is_active=true&page_size=200"
      ),
      apiFetch<Paginated<ApiProduct>>(
        "/api/products/?is_available=true&page_size=200"
      ),
      apiFetch<ApiOffer | Paginated<ApiOffer>>("/api/offers/active/"),
    ]);

  if (
    categoriesResult.status !== "fulfilled" ||
    productsResult.status !== "fulfilled"
  ) {
    return null;
  }

  const categories = categoriesResult.value.results.map(mapCategory);
  const items = productsResult.value.results.map(mapProduct);

  const offers: OfferItem[] = [];
  if (offersResult.status === "fulfilled") {
    const payload = offersResult.value;
    if (Array.isArray((payload as Paginated<ApiOffer>).results)) {
      offers.push(
        ...(payload as Paginated<ApiOffer>).results.map(mapOffer)
      );
    } else {
      offers.push(mapOffer(payload as ApiOffer));
    }
  }

  const allCategory = fallbackCategories.find((category) => category.id === "all");

  return {
    categories: allCategory ? [allCategory, ...categories] : categories,
    items,
    offers,
  };
};

export const fetchMenuItemById = async (
  id: number
): Promise<MenuItem | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }

  try {
    const product = await apiFetch<ApiProduct>(`/api/products/${id}/`);
    return mapProduct(product);
  } catch {
    return null;
  }
};
