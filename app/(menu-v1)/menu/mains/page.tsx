"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import type { LocalizedText } from "../../../lib/i18n";
import { formatCurrency, getLocalizedText } from "../../../lib/i18n";
import { useLanguage } from "../../../components/language-provider";
import { fetchMenuCatalog } from "../../../services/menu-api";
import type { MenuCategory, MenuItem } from "../../../lib/menu-data";

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
  { id: "apps", label: { ar: "مقبلات", en: "Appetizers" }, icon: "🍟", href: "/menu/appetizers" },
  { id: "mains", label: { ar: "وجبات رئيسية", en: "Mains" }, icon: "🍔", active: true, href: "/menu/mains" },
  { id: "drinks", label: { ar: "مشروبات", en: "Drinks" }, icon: "🥤", href: "/menu/drinks" },
  { id: "desserts", label: { ar: "حلويات", en: "Desserts" }, icon: "🍰", href: "/menu" },
];

export default function MainsPage() {
  const { dir, lang, t } = useLanguage();
  const [catalog, setCatalog] = useState<{
    categories: MenuCategory[];
    items: MenuItem[];
  }>({
    categories: [],
    items: [],
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadCatalog = async () => {
      const data = await fetchMenuCatalog();
      if (!mounted) {
        return;
      }
      setCatalog({
        categories: data?.categories ?? [],
        items: data?.items ?? [],
      });
      setIsLoading(false);
    };

    loadCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  const categoryId = useMemo(() => {
    const match = catalog.categories.find((category) => {
      const labelAr = (category.label.ar ?? "").toLowerCase();
      const labelEn = (category.label.en ?? "").toLowerCase();
      return (
        labelAr.includes("رئيس") ||
        labelEn.includes("main") ||
        labelEn.includes("entree") ||
        labelEn.includes("meal")
      );
    });
    return match?.id ?? "";
  }, [catalog.categories]);

  const items = useMemo(() => {
    if (!categoryId) {
      return [];
    }
    return catalog.items.filter((item) => item.category === categoryId);
  }, [catalog.items, categoryId]);

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-4">
          <h1 className="text-xl font-semibold sm:text-2xl">
            {t("mainsPageTitle")}
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
          {isLoading ? (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              Loading...
            </div>
          ) : items.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <h3 className="text-base font-semibold text-slate-800">
                {t("emptyMenuTitle")}
              </h3>
              <p className="mt-2">{t("emptyMenuMessage")}</p>
            </div>
          ) : (
            items.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
              >
                <Link href={`/menu/${item.id}`} className="block">
                  <img
                    src={item.image}
                    alt={getLocalizedText(item.name, lang)}
                    className="h-52 w-full object-cover"
                    loading="lazy"
                  />
                </Link>
                <div className="relative px-6 pb-6 pt-4 text-sm">
                  <Link href={`/menu/${item.id}`}>
                    <h2 className="text-base font-semibold">
                      {getLocalizedText(item.name, lang)}
                    </h2>
                  </Link>
                  <p className="mt-1 text-slate-500">
                    {getLocalizedText(item.desc, lang)}
                  </p>
                  <p className="mt-3 text-orange-500">
                    {formatCurrency(item.price, lang)}
                  </p>
                  <Link
                    href={`/menu/${item.id}`}
                    className="absolute -left-4 -bottom-4 flex h-12 w-12 items-center justify-center rounded-full bg-orange-500 text-xl text-white shadow-[0_10px_18px_rgba(234,106,54,0.35)]"
                    aria-label={t("addToCart")}
                  >
                    +
                  </Link>
                </div>
              </article>
            ))
          )}
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

