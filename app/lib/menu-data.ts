import type { LocalizedText } from "./i18n";

export type MenuCategory = {
  id: string;
  label: LocalizedText;
  icon: string;
};

export type MenuExtra = {
  id: string;
  label: LocalizedText;
  price: number;
};

export type MenuItem = {
  id: number;
  name: LocalizedText;
  desc: LocalizedText;
  price: number;
  category: string;
  image: string;
  tag?: "new" | "hot";
  extras?: MenuExtra[];
};

export type OfferItem = {
  id: number;
  title: LocalizedText;
  desc: LocalizedText;
  price: number;
  oldPrice?: number;
  badge?: string;
  image: string;
};
