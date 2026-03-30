"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Tajawal, Playfair_Display } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../../../lib/i18n";
import { useLanguage } from "../../../../components/language-provider";
import {
  applyMenuTheme,
  getMenuTheme,
  setMenuTheme,
  type MenuTheme,
} from "../../../../lib/menu-theme";
import { menuV3Categories, menuV3Items } from "../../data";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MenuV3CategoryPage() {
  const params = useParams();
  const { dir, lang } = useLanguage();
  const [theme, setTheme] = useState<MenuTheme>("light");
  const headingFont = lang === "ar" ? tajawal.className : playfair.className;
  const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
  const categoryId = idValue ?? "";
  const backIcon = dir === "rtl" ? "→" : "←";

  const category = useMemo(
    () => menuV3Categories.find((entry) => entry.id === categoryId) ?? null,
    [categoryId]
  );

  const items = useMemo(
    () => menuV3Items.filter((item) => item.category === categoryId),
    [categoryId]
  );

  const featuredItem = items[0] ?? null;

  const themeVars = useMemo(
    () =>
      ({
        "--v3-cream": theme === "dark" ? "#252b27" : "#faf6f0",
        "--v3-ink": theme === "dark" ? "#f4efe7" : "#2a2f2c",
        "--v3-muted": theme === "dark" ? "#d0c6bb" : "#7a6f65",
        "--v3-accent": theme === "dark" ? "#e18b6b" : "#b85d3d",
        "--v3-olive": theme === "dark" ? "#95a69f" : "#50615a",
        "--v3-bg":
          theme === "dark"
            ? "radial-gradient(70% 40% at 15% 0%, rgba(96, 69, 49, 0.35) 0%, rgba(37, 43, 39, 0) 60%), radial-gradient(80% 45% at 85% 0%, rgba(65, 88, 74, 0.35) 0%, rgba(37, 43, 39, 0) 65%), linear-gradient(180deg, #252b27 0%, #1f2421 55%, #1b1f1d 100%)"
            : "radial-gradient(65% 45% at 12% 0%, rgba(255,231,212,0.7) 0%, rgba(255,231,212,0) 60%), radial-gradient(60% 40% at 85% 10%, rgba(224,242,237,0.6) 0%, rgba(224,242,237,0) 65%), linear-gradient(180deg, #faf6f0 0%, #f4eee7 50%, #efe7dd 100%)",
      }) as CSSProperties,
    [theme]
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setMenuTheme(next);
  };

  useEffect(() => {
    const className = "menu-v3-skin";
    document.body.classList.add(className);
    document.documentElement.classList.add(className);
    const storedTheme = getMenuTheme();
    setTheme(storedTheme);
    applyMenuTheme(storedTheme);
    return () => {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);
      document.body.classList.remove("menu-v3-dark");
      document.documentElement.classList.remove("menu-v3-dark");
    };
  }, []);

  const categoryLabel = category
    ? getLocalizedText(category.label, lang)
    : lang === "ar"
      ? "تصنيف غير موجود"
      : "Category not found";

  return (
    <div
      className={`${headingFont} relative min-h-screen text-[17px] sm:text-[19px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={themeVars}
    >
      <div className="absolute inset-0 -z-10" style={{ background: "var(--v3-bg)" }} />
      <div className="pointer-events-none absolute -top-32 left-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(232,161,127,0.35),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-40 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(123,156,140,0.35),transparent_65%)] blur-2xl" />

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/70 bg-[color:var(--v3-cream)]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <div className="flex items-center gap-3">
            <Link
              href="/menu-v3"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            >
              <span className="text-sm">{backIcon}</span>
              {lang === "ar" ? "العودة للمنيو" : "Back to Menu"}
            </Link>
            {category?.icon ? (
              <span className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg text-[color:var(--v3-accent)] shadow-[0_10px_18px_rgba(15,23,42,0.12)]">
                {category.icon}
              </span>
            ) : null}
          </div>
          <button
            type="button"
            onClick={toggleTheme}
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            aria-label={theme === "dark" ? "Light mode" : "Dark mode"}
            title={theme === "dark" ? "Light mode" : "Dark mode"}
          >
            {theme === "dark" ? (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <circle cx="12" cy="12" r="4" />
                <path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                <path d="M21 12.8A8.2 8.2 0 1 1 11.2 3a6.5 6.5 0 0 0 9.8 9.8Z" />
              </svg>
            )}
          </button>
        </header>

        <section className="mt-10 rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_22px_40px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="relative overflow-hidden rounded-[28px] border border-white/60 bg-white/70 p-6 shadow-[0_16px_32px_rgba(15,23,42,0.1)] sm:p-8">
            <div className="pointer-events-none absolute -left-20 -top-16 h-48 w-48 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(232,161,127,0.35),transparent_70%)]" />
            <div className="pointer-events-none absolute -right-16 top-10 h-56 w-56 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(123,156,140,0.35),transparent_70%)]" />

            <div className="relative z-10 flex flex-wrap items-center justify-between gap-6">
              <div className="space-y-3">
                <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.2em] text-[color:var(--v3-muted)]">
                  {lang === "ar" ? "تصنيف" : "Category"}
                </span>
                <h1 className={`text-2xl font-semibold sm:text-3xl ${headingFont}`}>
                  {lang === "ar" ? `قائمة ${categoryLabel}` : `${categoryLabel} Menu`}
                </h1>
                <p className="max-w-xl text-sm text-[color:var(--v3-muted)]">
                  {lang === "ar"
                    ? "اختر ما يناسبك من أفضل الأصناف المرتبة بعناية."
                    : "Explore curated selections crafted for a refined dining experience."}
                </p>
                <div className="flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-center gap-2 rounded-full bg-[color:var(--v3-accent)] px-3 py-1 text-xs font-semibold text-white shadow-[0_10px_20px_rgba(184,93,61,0.3)]">
                    {lang === "ar" ? `عدد العناصر ${items.length}` : `${items.length} items`}
                  </span>
                  {category?.icon ? (
                    <span className="inline-flex items-center gap-2 rounded-full border border-white/60 bg-white/80 px-3 py-1 text-xs font-semibold text-[color:var(--v3-ink)]">
                      <span className="text-base">{category.icon}</span>
                      {categoryLabel}
                    </span>
                  ) : null}
                </div>
              </div>
              <div className="relative h-28 w-28 overflow-hidden rounded-[26px] border border-white/70 bg-white/90 shadow-[0_12px_24px_rgba(15,23,42,0.12)] sm:h-36 sm:w-36">
                {featuredItem ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={featuredItem.image}
                    alt={getLocalizedText(featuredItem.name, lang)}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-2xl text-[color:var(--v3-accent)]">
                    {category?.icon ?? "✿"}
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8 rounded-[32px] border border-white/60 bg-white/85 px-5 py-7 shadow-[0_18px_35px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8">
          {!category ? (
            <div className="mt-8 text-center text-sm text-[color:var(--v3-muted)]">
              {lang === "ar"
                ? "هذا التصنيف غير متوفر حالياً."
                : "This category is not available right now."}
            </div>
          ) : items.length === 0 ? (
            <div className="mt-8 text-center text-sm text-[color:var(--v3-muted)]">
              {lang === "ar"
                ? "لا توجد منتجات في هذا التصنيف."
                : "No items in this category."}
            </div>
          ) : (
            <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Link
                  key={item.id}
                  href={`/menu-v3/${item.id}`}
                  className="group relative overflow-hidden rounded-[26px] border border-white/70 bg-white/85 p-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_18px_30px_rgba(15,23,42,0.12)]"
                >
                  <div
                    className="absolute inset-0 opacity-0 transition group-hover:opacity-100"
                    style={{
                      background:
                        "linear-gradient(120deg, rgba(232,161,127,0.12), rgba(123,156,140,0.12))",
                    }}
                  />
                  <div className="relative z-10 flex items-center gap-4">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={getLocalizedText(item.name, lang)}
                      className="h-16 w-16 rounded-2xl object-cover shadow-[0_10px_18px_rgba(15,23,42,0.12)] transition group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className={`text-base font-semibold ${headingFont}`}>
                          {getLocalizedText(item.name, lang)}
                        </p>
                        <span className="ml-auto rounded-full bg-[color:var(--v3-accent)] px-2.5 py-1 text-[11px] font-semibold text-white">
                          {formatCurrency(item.price, lang)}
                        </span>
                      </div>
                      <p className="mt-1 text-xs text-[color:var(--v3-muted)]">
                        {getLocalizedText(item.desc, lang)}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>
      </div>

      <style jsx global>{`
        .menu-v3-skin {
          background: var(--v3-cream) !important;
          color: var(--v3-ink);
        }
        body.menu-v3-skin {
          background: var(--v3-cream) !important;
        }
        html.menu-v3-skin {
          background: var(--v3-cream) !important;
        }
      `}</style>
    </div>
  );
}
