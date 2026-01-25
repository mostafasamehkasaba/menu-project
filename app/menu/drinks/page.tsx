"use client";

import Link from "next/link";
import { Cairo } from "next/font/google";
import type { LocalizedText } from "../../lib/i18n";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const categories: {
  id: string;
  label: LocalizedText;
  icon: string;
  href: string;
  active?: boolean;
}[] = [
  { id: "all", label: { ar: "الكل", en: "All" }, icon: "✦", href: "/menu" },
  { id: "apps", label: { ar: "مقبلات", en: "Appetizers" }, icon: "🥗", href: "/menu/appetizers" },
  { id: "mains", label: { ar: "وجبات رئيسية", en: "Mains" }, icon: "🍔", href: "/menu/mains" },
  { id: "drinks", label: { ar: "مشروبات", en: "Drinks" }, icon: "🥤", active: true, href: "/menu/drinks" },
  { id: "desserts", label: { ar: "حلويات", en: "Desserts" }, icon: "🍰", href: "/menu" },
];

const drinks: {
  id: number;
  name: LocalizedText;
  desc: LocalizedText;
  price: number;
  image: string;
}[] = [
  {
    id: 1,
    name: { ar: "موهيتو", en: "Mojito" },
    desc: { ar: "مشروب منعش بالنعناع والليمون", en: "Refreshing drink with mint and lemon" },
    price: 40,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 2,
    name: { ar: "عصير برتقال طازج", en: "Fresh orange juice" },
    desc: { ar: "عصير برتقال طبيعي 100% بدون إضافات", en: "100% natural orange juice, no additives" },
    price: 35,
    image:
      "https://images.unsplash.com/photo-1497534446932-c925b458314e?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 3,
    name: { ar: "سموثي فراولة", en: "Strawberry smoothie" },
    desc: { ar: "فراولة طازجة مع حليب", en: "Fresh strawberries with milk" },
    price: 45,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: 4,
    name: { ar: "ليمون بالنعناع", en: "Mint lemonade" },
    desc: { ar: "ليمون فريش مع نعناع", en: "Fresh lemon with mint" },
    price: 38,
    image:
      "https://images.unsplash.com/photo-1464306076886-da185f6a9d2d?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function DrinksPage() {
  const { dir, lang, t } = useLanguage();
  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold sm:text-2xl">
            {t("drinksPageTitle")}
          </h1>
          <div className="flex flex-wrap items-center gap-3">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={category.href}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_18px_rgba(15,23,42,0.08)] ${
                  category.active
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-700"
                }`}
              >
                <span>{category.icon}</span>
                {getLocalizedText(category.label, lang)}
              </Link>
            ))}
          </div>
        </header>

        <section className="mt-10 grid gap-6 md:grid-cols-2">
          {drinks.map((item) => (
            <article
              key={item.id}
              className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
            >
              <img
                src={item.image}
                alt={getLocalizedText(item.name, lang)}
                className="h-52 w-full object-cover"
                loading="lazy"
              />
              <div className="relative px-6 pb-6 pt-4 text-sm">
                <h2 className="text-base font-semibold">
                  {getLocalizedText(item.name, lang)}
                </h2>
                <p className="mt-1 text-slate-500">
                  {getLocalizedText(item.desc, lang)}
                </p>
                <p className="mt-3 text-orange-500">
                  {formatCurrency(item.price, lang)}
                </p>
                <button className="absolute -left-4 -bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl text-white shadow-[0_10px_18px_rgba(234,106,54,0.35)]">
                  +
                </button>
              </div>
            </article>
          ))}
        </section>
      </div>

      <button className="fixed bottom-20 right-6 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)]">
        {t("talkWithUs")}
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
          💬
        </span>
      </button>
    </div>
  );
}
