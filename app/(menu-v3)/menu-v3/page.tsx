"use client";

import { useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Amiri, Cormorant_Garamond } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";
import type { MenuItem } from "../../lib/menu-data";
import { menuV3Catalog, type MenuCatalog } from "./data";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const navItems = [
  { id: "home", labelAr: "الرئيسية", labelEn: "Home" },
  { id: "menu", labelAr: "المنيو", labelEn: "Menu" },
  { id: "sections", labelAr: "الأقسام", labelEn: "Sections" },
  { id: "contact", labelAr: "تواصل", labelEn: "Contact" },
];

type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

const fallbackHeroItems: MenuItem[] = [
  {
    id: -101,
    name: { ar: "طبق مميز", en: "Signature Dish" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "breakfast",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -102,
    name: { ar: "وجبة صحية", en: "Healthy Bowl" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -103,
    name: { ar: "ستيك مشوي", en: "Grilled Steak" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "dinner",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -104,
    name: { ar: "باستا", en: "Pasta" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "lunch",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
  },
];

export default function MenuV3Page() {
  const { dir, lang, t, toggleLang } = useLanguage();
  const [catalog] = useState<MenuCatalog>(menuV3Catalog);

  useEffect(() => {
    const className = "menu-v3-skin";
    document.body.classList.add(className);
    document.documentElement.classList.add(className);
    return () => {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);
    };
  }, []);

  const heroImages = useMemo<MenuItem[]>(() => {
    const source = catalog.items.length ? catalog.items : fallbackHeroItems;
    const needed = 8;
    const result: MenuItem[] = [];
    let index = 0;
    while (result.length < needed) {
      result.push(source[index % source.length]);
      index += 1;
    }
    return result;
  }, [catalog.items]);

  const menuSections = useMemo<MenuSection[]>(() => {
    return catalog.categories.map((category) => ({
      id: category.id,
      title:
        lang === "ar"
          ? `${getLocalizedText(category.label, lang)} الخاصة`
          : `${getLocalizedText(category.label, lang)} Special Menu`,
      items: catalog.items.filter((item) => item.category === category.id),
    }));
  }, [catalog.categories, catalog.items, lang]);

  return (
    <div
      className={`${amiri.className} min-h-screen text-[16px] sm:text-[18px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={
        {
          "--v3-cream": "#f8f4ee",
          "--v3-ink": "#2a2f2c",
          "--v3-muted": "#7a6f65",
          "--v3-accent": "#b85d3d",
          "--v3-olive": "#50615a",
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_40%_at_15%_0%,#fff2e8_0%,rgba(255,242,232,0)_60%),radial-gradient(80%_45%_at_85%_0%,#e9f2ee_0%,rgba(233,242,238,0)_65%),linear-gradient(180deg,#f8f4ee_0%,#f3ede7_55%,#efe7df_100%)]" />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header id="home" className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--v3-accent)] text-white shadow-[0_12px_20px_rgba(184,93,61,0.25)]">
              U
            </div>
            <div className="text-right">
              <p className={`text-base font-semibold ${cormorant.className}`}>
                {t("restaurantName")}
              </p>
              <p className="text-sm text-[color:var(--v3-muted)]">
                {lang === "ar" ? "تجربة طعام أنيقة" : "Elegant Dining Experience"}
              </p>
            </div>
          </div>

          <nav className={`hidden items-center gap-6 text-sm font-semibold text-[color:var(--v3-muted)] lg:flex ${cormorant.className}`}>
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="hover:text-[color:var(--v3-accent)]">
                {lang === "ar" ? item.labelAr : item.labelEn}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="h-10 w-10 rounded-full bg-white text-sm font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
              aria-label={t("language")}
              title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>
            <Link
              href="/menu-v3/cart"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-base text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
              aria-label={t("cart")}
              title={t("cart")}
            >
              🛒
            </Link>
            <a
              href="tel:0555000111"
              className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-[color:var(--v3-accent)] shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
            >
              0555-000-111
            </a>
          </div>
        </header>

        <section className="mt-8 rounded-[36px] border border-white/70 bg-white/75 px-5 py-7 text-center shadow-[0_24px_50px_rgba(15,23,42,0.12)] backdrop-blur sm:px-6 sm:py-8">
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--v3-accent)] ${cormorant.className}`}>
            {lang === "ar" ? "نكهات اليوم" : "Taste of the Day"}
          </p>
          <h1 className={`mt-4 text-4xl font-semibold sm:text-5xl ${cormorant.className}`}>
            {lang === "ar" ? "اكتشف أطباقنا المميزة" : "Discover Our Signature Dishes"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--v3-muted)]">
            {lang === "ar"
              ? "قائمة مصممة بعناية لتجمع بين الطعم الراقي والتقديم الأنيق."
              : "A curated menu combining refined flavors with elegant presentation."}
          </p>
        </section>

        <section className="mt-10">
          <div className="relative hero-marquee-wrap">
            <div className={`hero-marquee ${dir === "rtl" ? "hero-marquee-rtl" : "hero-marquee-ltr"}`}>
              {[...heroImages, ...heroImages].map((item, index) => (
                <div
                  key={`${item.id}-${index}`}
                  className="hero-card overflow-hidden rounded-[22px] bg-white"
                  style={{ "--tilt": index % 2 === 0 ? "-3deg" : "3deg" } as CSSProperties}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={getLocalizedText(item.name, lang)}
                    className="h-full w-full object-cover"
                    loading="lazy"
                  />
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="mt-12 border-t border-dashed border-[color:var(--v3-olive)]/30" />

        <section id="menu" className="mt-12 space-y-14">
          {menuSections.map((section) => (
            <div key={section.id} className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white text-[color:var(--v3-accent)] shadow-[0_10px_16px_rgba(15,23,42,0.12)]">
                  ✿
                </div>
                <h2 className={`text-2xl font-semibold ${cormorant.className}`}>{section.title}</h2>
              </div>

              <div className="rounded-[32px] border border-white/60 bg-white/85 px-5 py-6 shadow-[0_18px_35px_rgba(15,23,42,0.1)] sm:px-6 sm:py-7">
                <div className="grid gap-6 lg:grid-cols-2">
                  {section.items.map((item) => (
                    <div key={item.id} className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={getLocalizedText(item.name, lang)}
                        className="h-14 w-14 rounded-2xl object-cover"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className={`text-base font-semibold ${cormorant.className}`}>
                            {getLocalizedText(item.name, lang)}
                          </p>
                          <span className="flex-1 border-b border-dotted border-[color:var(--v3-olive)]/30" />
                          <span className="text-sm font-semibold text-[color:var(--v3-accent)]">
                            {formatCurrency(item.price, lang)}
                          </span>
                        </div>
                        <p className="text-xs text-[color:var(--v3-muted)]">
                          {getLocalizedText(item.desc, lang)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/menu-v3/cart"
                    className="rounded-full bg-[color:var(--v3-accent)] px-6 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.35)]"
                  >
                    {lang === "ar" ? "اذهب للسلة" : "Go to Cart"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section id="sections" className="mt-16">
          <div className="text-center">
            <h2 className={`text-2xl font-semibold ${cormorant.className}`}>
              {lang === "ar" ? "اختيارات اليوم" : "Today’s Picks"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--v3-muted)]">
              {lang === "ar"
                ? "أطباق مختارة بعناية لتناسب مزاجك."
                : "Carefully selected dishes that match your mood."}
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {catalog.items.slice(0, 6).map((item) => (
              <article
                key={item.id}
                className="group overflow-hidden rounded-[26px] bg-white shadow-[0_16px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_22px_36px_rgba(15,23,42,0.16)]"
              >
                <Link href={`/menu-v3/${item.id}`} className="block">
                  <div className="relative">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={getLocalizedText(item.name, lang)}
                      className="h-40 w-full object-cover transition duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                </Link>
                <div className="space-y-2 px-5 pb-5 pt-4 text-sm">
                  <Link href={`/menu-v3/${item.id}`}>
                    <h3 className={`text-lg font-semibold ${cormorant.className}`}>
                      {getLocalizedText(item.name, lang)}
                    </h3>
                  </Link>
                  <p className="text-xs text-[color:var(--v3-muted)]">
                    {getLocalizedText(item.desc, lang)}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-[color:var(--v3-accent)]">
                      {formatCurrency(item.price, lang)}
                    </span>
                    <Link
                      href={`/menu-v3/${item.id}`}
                      className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                    >
                      {lang === "ar" ? "تفاصيل" : "Details"}
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>

      <footer
        id="contact"
        className="mt-12 w-full border-y border-white/60 bg-white/85 shadow-[0_18px_32px_rgba(184,93,61,0.1)] backdrop-blur"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-base sm:text-[18px] md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className={`text-lg font-semibold ${cormorant.className}`}>
              {lang === "ar" ? "تواصل" : "Contact"}
            </p>
            <p className="text-[color:var(--v3-muted)]">0555-000-111</p>
            <p className="text-[color:var(--v3-muted)]">
              {lang === "ar" ? "الرياض، شارع العليا" : "Riyadh, Al Olaya Street"}
            </p>
            <p className="text-[color:var(--v3-muted)]">hello@restaurant.com</p>
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${cormorant.className}`}>
              {lang === "ar" ? "التنقل" : "Navigate"}
            </p>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-[color:var(--v3-muted)] hover:text-[color:var(--v3-accent)]"
              >
                {lang === "ar" ? item.labelAr : item.labelEn}
              </a>
            ))}
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${cormorant.className}`}>
              {lang === "ar" ? "الأقسام" : "Menu"}
            </p>
            {menuSections.map((section) => (
              <span key={section.id} className="block text-[color:var(--v3-muted)]">
                {section.title}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${cormorant.className}`}>
              {lang === "ar" ? "تابعنا" : "Follow Us"}
            </p>
            <span className="block text-[color:var(--v3-muted)]">Instagram</span>
            <span className="block text-[color:var(--v3-muted)]">Facebook</span>
            <span className="block text-[color:var(--v3-muted)]">TikTok</span>
            <span className="block text-[color:var(--v3-muted)]">X</span>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-10 text-center text-sm text-[color:var(--v3-muted)]">
          {lang === "ar" ? "© 2026 جميع الحقوق محفوظة" : "© 2026 All rights reserved"}
        </div>
      </footer>

      <style jsx>{`
        .hero-marquee-wrap {
          overflow: hidden;
          padding: 18px 0 26px;
        }
        .hero-marquee {
          display: flex;
          align-items: center;
          gap: 16px;
          width: max-content;
          animation: hero-marquee 26s linear infinite;
          padding: 6px 0;
          will-change: transform;
        }
        .hero-marquee-rtl {
          animation-direction: reverse;
        }
        .hero-card {
          flex: 0 0 auto;
          height: 130px;
          width: 190px;
          transform: rotate(var(--tilt));
          transform-origin: center;
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 16px 28px rgba(42, 47, 44, 0.12);
        }
        @media (max-width: 480px) {
          .hero-card {
            height: 110px;
            width: 160px;
          }
        }
        @media (min-width: 640px) {
          .hero-card {
            height: 150px;
            width: 210px;
          }
        }
        @keyframes hero-marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
      `}</style>
      <style jsx global>{`
        .menu-v3-skin {
          background: #f8f4ee !important;
          color: #2a2f2c;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
