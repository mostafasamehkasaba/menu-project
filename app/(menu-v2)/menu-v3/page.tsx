"use client";

import { useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import Link from "next/link";
import { Tajawal, Playfair_Display } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";
import type { MenuItem } from "../../lib/menu-data";
import {
  applyMenuTheme,
  getMenuTheme,
  setMenuTheme,
  type MenuTheme,
} from "../../lib/menu-theme";
import { menuV3Catalog, type MenuCatalog } from "./data";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

const navItems = [
  { id: "home", labelAr: "الرئيسية", labelEn: "Home", href: "/menu-v3#home" },
  { id: "menu", labelAr: "المنيو", labelEn: "Menu", href: "/menu-v3#menu" },
  { id: "sections", labelAr: "الأقسام", labelEn: "Sections", href: "/menu-v3#sections" },
  { id: "reservations", labelAr: "الحجوزات", labelEn: "Reservations", href: "/menu-v3/reservations" },
  { id: "contact", labelAr: "تواصل", labelEn: "Contact", href: "/menu-v3#contact" },
  { id: "settings", labelAr: "الإعدادات", labelEn: "Settings", href: "/menu-v3/settings" },
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
    category: "appetizers",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -102,
    name: { ar: "وجبة صحية", en: "Healthy Bowl" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -103,
    name: { ar: "ستيك مشوي", en: "Grilled Steak" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: -104,
    name: { ar: "باستا", en: "Pasta" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "mains",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=800&q=80",
  },
];

export default function MenuV3Page() {
  const { dir, lang, t, toggleLang } = useLanguage();
  const [catalog] = useState<MenuCatalog>(menuV3Catalog);
  const [theme, setTheme] = useState<MenuTheme>("light");
  const headingFont = lang === "ar" ? tajawal.className : playfair.className;
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const heroStripRef = useRef<HTMLDivElement | null>(null);

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

  useEffect(() => {
    const readStatus = () => {
      const stored = window.localStorage.getItem("restaurant_open");
      setIsRestaurantOpen(stored !== "false");
    };

    readStatus();

    const onStatus = (event: Event) => {
      const detail = (event as CustomEvent<{ open?: boolean }>).detail;
      if (typeof detail?.open === "boolean") {
        setIsRestaurantOpen(detail.open);
      }
    };

    const onStorage = (event: StorageEvent) => {
      if (event.key === "restaurant_open") {
        setIsRestaurantOpen(event.newValue !== "false");
      }
    };

    window.addEventListener("app:restaurant-status", onStatus);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener("app:restaurant-status", onStatus);
      window.removeEventListener("storage", onStorage);
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


  const offersToday = useMemo(
    () => {
      const source = catalog.items.length ? catalog.items : fallbackHeroItems;
      const badges = [
        { ar: "خصم 20%", en: "20% off" },
        { ar: "عرض محدود", en: "Limited deal" },
        { ar: "الأكثر طلبًا", en: "Most ordered" },
        { ar: "جديد اليوم", en: "New today" },
      ];

      return source.slice(0, 4).map((item, index) => {
        const multiplier = [1.25, 1.2, 1.3, 1.18][index % 4];
        const oldPrice = Math.round(item.price * multiplier);
        return {
          item,
          badge: badges[index % badges.length],
          oldPrice,
        };
      });
    },
    [catalog.items]
  );

  const quickStats = useMemo(
    () => [
      {
        id: "status",
        labelAr: "حالة المطعم",
        labelEn: "Restaurant Status",
        valueAr: isRestaurantOpen ? "مفتوح الآن" : "مغلق الآن",
        valueEn: isRestaurantOpen ? "Open now" : "Closed now",
        metaAr: isRestaurantOpen ? "حتى 11:30 مساءً" : "نعود 12:00 ظهرًا",
        metaEn: isRestaurantOpen ? "Until 11:30 PM" : "Back at 12:00 PM",
        tone: isRestaurantOpen ? "emerald" : "rose",
      },
      {
        id: "eta",
        labelAr: "وقت التوصيل المتوقع",
        labelEn: "Delivery ETA",
        valueAr: "25-35 دقيقة",
        valueEn: "25-35 min",
        metaAr: "يُحدّث كل 10 دقائق",
        metaEn: "Updated every 10 minutes",
        tone: "amber",
      },
      {
        id: "booking",
        labelAr: "أقرب وقت حجز",
        labelEn: "Next Available",
        valueAr: "اليوم 18:30",
        valueEn: "Today 18:30",
        metaAr: "متاح الآن للحجز",
        metaEn: "Ready for booking",
        tone: "indigo",
      },
    ],
    [isRestaurantOpen]
  );

  const menuSections = useMemo<MenuSection[]>(() => {
    return catalog.categories.map((category) => ({
      id: category.id,
      title:
        lang === "ar"
          ? `قائمة ${getLocalizedText(category.label, lang)}`
          : `${getLocalizedText(category.label, lang)} Menu`,
      items: catalog.items.filter((item) => item.category === category.id),
    }));
  }, [catalog.categories, catalog.items, lang]);


  const scrollHeroStrip = (direction: "prev" | "next") => {
    if (!heroStripRef.current) {
      return;
    }
    const baseOffset = direction === "next" ? 360 : -360;
    const offset = dir === "rtl" ? -baseOffset : baseOffset;
    heroStripRef.current.scrollBy({ left: offset, behavior: "smooth" });
  };
  const prevArrow = dir === "rtl" ? "›" : "‹";
  const nextArrow = dir === "rtl" ? "‹" : "›";

  const themeVars = useMemo(
    () =>
      ({
        "--v3-cream": theme === "dark" ? "#141615" : "#f8f4ee",
        "--v3-ink": theme === "dark" ? "#f4efe7" : "#2a2f2c",
        "--v3-muted": theme === "dark" ? "#c5b8ab" : "#7a6f65",
        "--v3-accent": theme === "dark" ? "#e18b6b" : "#b85d3d",
        "--v3-olive": theme === "dark" ? "#95a69f" : "#50615a",
        "--v3-bg":
          theme === "dark"
            ? "radial-gradient(70% 40% at 15% 0%, rgba(57, 39, 28, 0.45) 0%, rgba(20, 22, 21, 0) 60%), radial-gradient(80% 45% at 85% 0%, rgba(40, 58, 52, 0.4) 0%, rgba(20, 22, 21, 0) 65%), linear-gradient(180deg, #111312 0%, #0f1110 55%, #0b0d0c 100%)"
            : "radial-gradient(70%_40%_at_15%_0%,#fff2e8_0%,rgba(255,242,232,0)_60%),radial-gradient(80%_45%_at_85%_0%,#e9f2ee_0%,rgba(233,242,238,0)_65%),linear-gradient(180deg,#f8f4ee_0%,#f3ede7_55%,#efe7df_100%)",
      }) as CSSProperties,
    [theme]
  );

  const toggleTheme = () => {
    const next = theme === "dark" ? "light" : "dark";
    setTheme(next);
    setMenuTheme(next);
  };

  const toneStyles: Record<string, string> = {
    emerald: "bg-emerald-100 text-emerald-600",
    amber: "bg-amber-100 text-amber-600",
    indigo: "bg-indigo-100 text-indigo-600",
    rose: "bg-rose-100 text-rose-600",
  };

  return (
    <div
      className={`${headingFont} min-h-screen text-[17px] sm:text-[19px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={themeVars}
    >
      <div className="absolute inset-0 -z-10" style={{ background: "var(--v3-bg)" }} />

      <div className="mx-auto max-w-6xl px-4 pb-16 pt-8 sm:px-6 lg:px-8">
        <header
          id="home"
          className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/70 bg-[color:var(--v3-cream)]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--v3-accent)] text-white shadow-[0_12px_20px_rgba(184,93,61,0.25)]">
              U
            </div>
            <div className="text-right">
              <p className={`text-base font-semibold ${headingFont}`}>{t("restaurantName")}</p>
              <p className="text-sm text-[color:var(--v3-muted)]">
                {lang === "ar" ? "تجربة طعام أنيقة" : "Elegant Dining Experience"}
              </p>
            </div>
          </div>

          <nav className={`hidden items-center gap-6 text-sm font-semibold text-[color:var(--v3-muted)] lg:flex ${headingFont}`}>
            {navItems.map((item) => (
              <Link key={item.id} href={item.href} className="hover:text-[color:var(--v3-accent)]">
                {lang === "ar" ? item.labelAr : item.labelEn}
              </Link>
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
            <Link
              href="/menu-v3/cart"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-base text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
              aria-label={t("cart")}
              title={t("cart")}
            >
              <svg
                viewBox="0 0 24 24"
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.6"
              >
                <path d="M3 5h2l2.2 9.5a2 2 0 0 0 2 1.5h7.8a2 2 0 0 0 2-1.5L21 7H7.2" />
                <circle cx="10" cy="20" r="1.6" />
                <circle cx="18" cy="20" r="1.6" />
              </svg>
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
          <p className={`text-xs font-semibold uppercase tracking-[0.22em] text-[color:var(--v3-accent)] ${headingFont}`}>
            {lang === "ar" ? "نكهات اليوم" : "Taste of the Day"}
          </p>
          <h1 className={`mt-4 text-4xl font-semibold sm:text-5xl ${headingFont}`}>
            {lang === "ar" ? "اكتشف أطباقنا المميزة" : "Discover Our Signature Dishes"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--v3-muted)]">
            {lang === "ar"
              ? "قائمة مصممة بعناية لتجمع بين الطعم الراقي والتقديم الأنيق."
              : "A curated menu combining refined flavors with elegant presentation."}
          </p>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--v3-accent)]">
                {lang === "ar" ? "مختارات الشيف" : "Chef Curations"}
              </p>
              <h2 className={`mt-2 text-2xl font-semibold ${headingFont}`}>
                {lang === "ar" ? "لقطات من مطبخنا" : "A Taste of Our Kitchen"}
              </h2>
            </div>
          </div>

          <div className="relative mt-6">
            <div className="carousel-shell relative overflow-hidden rounded-[34px] border border-white/70 bg-white/70 px-2 py-4 shadow-[0_20px_36px_rgba(15,23,42,0.12)] backdrop-blur sm:px-6">
              <div className="carousel-edge carousel-edge-left" aria-hidden="true" />
              <div className="carousel-edge carousel-edge-right" aria-hidden="true" />

              <button
                type="button"
                onClick={() => scrollHeroStrip("prev")}
                className="carousel-arrow absolute left-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[color:var(--v3-accent)] shadow-[0_12px_22px_rgba(15,23,42,0.15)] sm:grid"
                aria-label={lang === "ar" ? "السابق" : "Previous"}
              >
                {prevArrow}
              </button>
              <button
                type="button"
                onClick={() => scrollHeroStrip("next")}
                className="carousel-arrow absolute right-3 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 place-items-center rounded-full border border-white/70 bg-white/90 text-[color:var(--v3-accent)] shadow-[0_12px_22px_rgba(15,23,42,0.15)] sm:grid"
                aria-label={lang === "ar" ? "التالي" : "Next"}
              >
                {nextArrow}
              </button>

              <div
                ref={heroStripRef}
                className="editorial-scroll carousel-track flex gap-4 overflow-x-auto px-4 pb-2 pt-1 sm:px-14"
              >
                {heroImages.map((item) => (
                  <article
                    key={item.id}
                    className="editorial-card group min-w-[260px] rounded-[28px] border border-white/70 bg-white/90 shadow-[0_16px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_20px_34px_rgba(15,23,42,0.16)]"
                  >
                    <Link href={`/menu-v3/${item.id}`} className="block">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={getLocalizedText(item.name, lang)}
                        className="h-52 w-full rounded-t-[28px] object-cover transition duration-300 group-hover:scale-[1.02] sm:h-60"
                        loading="lazy"
                      />
                    </Link>
                    <div className="space-y-1 px-4 pb-4 pt-3 text-sm">
                      <p className={`text-base font-semibold ${headingFont}`}>
                        {getLocalizedText(item.name, lang)}
                      </p>
                      <p className="text-xs text-[color:var(--v3-muted)]">
                        {getLocalizedText(item.desc, lang)}
                      </p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="grid gap-4 sm:grid-cols-3">
            {quickStats.map((stat) => (
              <div
                key={stat.id}
                className="rounded-[24px] border border-white/70 bg-white/80 px-5 py-4 shadow-[0_14px_26px_rgba(15,23,42,0.1)] backdrop-blur"
              >
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--v3-muted)]">
                      {lang === "ar" ? stat.labelAr : stat.labelEn}
                    </p>
                    <p className={`mt-2 text-lg font-semibold ${headingFont}`}>
                      {lang === "ar" ? stat.valueAr : stat.valueEn}
                    </p>
                  </div>
                  <div
                    className={`grid h-11 w-11 place-items-center rounded-full ${toneStyles[stat.tone] ?? "bg-slate-100 text-slate-500"}`}
                  >
                    ●
                  </div>
                </div>
                <p className="mt-2 text-xs text-[color:var(--v3-muted)]">
                  {lang === "ar" ? stat.metaAr : stat.metaEn}
                </p>
              </div>
            ))}
          </div>
        </section>

        <div className="mt-12 border-t border-dashed border-[color:var(--v3-olive)]/30" />

        <section id="menu" className="mt-12 space-y-14 scroll-mt-28">
          {menuSections.map((section) => {
            const sectionItems = section.items.slice(0, 8);
            return (
            <div key={section.id} className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white text-[color:var(--v3-accent)] shadow-[0_10px_16px_rgba(15,23,42,0.12)]">
                  ✿
                </div>
                <h2 className={`text-2xl font-semibold ${headingFont}`}>{section.title}</h2>
              </div>

              <div className="rounded-[32px] border border-white/60 bg-white/85 px-5 py-6 shadow-[0_18px_35px_rgba(15,23,42,0.1)] sm:px-6 sm:py-7">
                <div className="grid gap-6 lg:grid-cols-2">
                  {sectionItems.map((item) => (
                    <Link
                      key={item.id}
                      href={`/menu-v3/${item.id}`}
                      className="menu-v3-item-row group flex items-center gap-4 rounded-2xl p-2 transition"
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={getLocalizedText(item.name, lang)}
                        className="h-14 w-14 rounded-2xl object-cover transition group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                      <div className="flex-1">
                        <div className="flex items-center gap-3">
                          <p className={`text-base font-semibold ${headingFont}`}>{getLocalizedText(item.name, lang)}</p>
                          <span className="flex-1 border-b border-dotted border-[color:var(--v3-olive)]/30" />
                          <span className="text-sm font-semibold text-[color:var(--v3-accent)]">
                            {formatCurrency(item.price, lang)}
                          </span>
                        </div>
                        <p className="text-xs text-[color:var(--v3-muted)]">{getLocalizedText(item.desc, lang)}</p>
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Link
                    href={`/menu-v3/category/${section.id}`}
                    className="rounded-full bg-[color:var(--v3-accent)] px-6 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.35)]"
                  >
                    {lang === "ar" ? "عرض المزيد" : "View More"}
                  </Link>
                </div>
              </div>
            </div>
          );
          })}
        </section>

        <section id="sections" className="mt-16 scroll-mt-28">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--v3-accent)]">
              {lang === "ar" ? "عروض اليوم" : "Today's Offers"}
            </p>
            <h2 className={`mt-2 text-2xl font-semibold ${headingFont}`}>
              {lang === "ar" ? "خصومات مميزة على أطباق مختارة" : "Signature deals on selected dishes"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--v3-muted)]">
              {lang === "ar"
                ? "استمتع بترشيحات اليوم مع خصومات محدودة."
                : "Enjoy today’s picks with limited-time savings."}
            </p>
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            {offersToday[0] ? (
              <article className="offer-hero overflow-hidden rounded-[34px] border border-white/70 bg-white/90 shadow-[0_22px_40px_rgba(15,23,42,0.15)]">
                <div className="relative">
                  <Link href={`/menu-v3/${offersToday[0].item.id}`} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={offersToday[0].item.image}
                      alt={getLocalizedText(offersToday[0].item.name, lang)}
                      className="h-64 w-full object-cover sm:h-80"
                      loading="lazy"
                    />
                  </Link>
                  <div className="offer-hero-gradient absolute inset-0" />
                  <span className="absolute left-6 top-6 rounded-full bg-[color:var(--v3-accent)] px-3 py-1 text-xs font-semibold text-white shadow-[0_8px_16px_rgba(184,93,61,0.35)]">
                    {lang === "ar" ? offersToday[0].badge.ar : offersToday[0].badge.en}
                  </span>
                  <div className="absolute bottom-6 left-6 right-6 rounded-[24px] bg-white/90 p-5 text-sm shadow-[0_16px_30px_rgba(15,23,42,0.2)] backdrop-blur">
                    <p className={`text-lg font-semibold ${headingFont}`}>
                      {getLocalizedText(offersToday[0].item.name, lang)}
                    </p>
                    <p className="mt-2 text-xs text-[color:var(--v3-muted)]">
                      {getLocalizedText(offersToday[0].item.desc, lang)}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="text-base font-semibold text-[color:var(--v3-accent)]">
                          {formatCurrency(offersToday[0].item.price, lang)}
                        </span>
                        {offersToday[0].oldPrice > offersToday[0].item.price ? (
                          <span className="text-xs text-slate-400 line-through">
                            {formatCurrency(offersToday[0].oldPrice, lang)}
                          </span>
                        ) : null}
                      </div>
                      <Link
                        href={`/menu-v3/${offersToday[0].item.id}`}
                        className="rounded-full bg-[color:var(--v3-accent)] px-4 py-2 text-xs font-semibold text-white shadow-[0_10px_18px_rgba(184,93,61,0.3)]"
                      >
                        {lang === "ar" ? "اطلب الآن" : "Order now"}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            ) : null}

            <div className="space-y-4">
              {offersToday.slice(1).map(({ item, badge, oldPrice }) => (
                <article
                  key={item.id}
                  className="offer-row flex items-center gap-4 rounded-[24px] border border-white/70 bg-white/90 p-4 shadow-[0_16px_30px_rgba(15,23,42,0.12)]"
                >
                  <Link href={`/menu-v3/${item.id}`} className="block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={getLocalizedText(item.name, lang)}
                      className="h-20 w-20 rounded-[18px] object-cover"
                      loading="lazy"
                    />
                  </Link>
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <p className={`text-sm font-semibold ${headingFont}`}>
                        {getLocalizedText(item.name, lang)}
                      </p>
                      <span className="rounded-full bg-[color:var(--v3-accent)]/10 px-2 py-0.5 text-[10px] font-semibold text-[color:var(--v3-accent)]">
                        {lang === "ar" ? badge.ar : badge.en}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-[color:var(--v3-muted)]">
                      {getLocalizedText(item.desc, lang)}
                    </p>
                    <div className="mt-2 flex items-center gap-2 text-xs">
                      <span className="font-semibold text-[color:var(--v3-accent)]">
                        {formatCurrency(item.price, lang)}
                      </span>
                      {oldPrice > item.price ? (
                        <span className="text-slate-400 line-through">
                          {formatCurrency(oldPrice, lang)}
                        </span>
                      ) : null}
                    </div>
                  </div>
                  <Link
                    href={`/menu-v3/${item.id}`}
                    className="rounded-full border border-slate-200 px-3 py-1 text-[11px] font-semibold text-slate-700"
                  >
                    {lang === "ar" ? "اطلب" : "Order"}
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </section>

      </div>

      <footer
        id="contact"
        className="mt-12 w-full border-y border-white/60 bg-white/85 shadow-[0_18px_32px_rgba(184,93,61,0.1)] backdrop-blur scroll-mt-28"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-10 text-base sm:text-[18px] md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "تواصل" : "Contact"}
            </p>
            <p className="text-[color:var(--v3-muted)]">0555-000-111</p>
            <p className="text-[color:var(--v3-muted)]">
              {lang === "ar" ? "الرياض، شارع العليا" : "Riyadh, Al Olaya Street"}
            </p>
            <p className="text-[color:var(--v3-muted)]">hello@restaurant.com</p>
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "التنقل" : "Navigate"}
            </p>
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="block text-[color:var(--v3-muted)] hover:text-[color:var(--v3-accent)]"
              >
                {lang === "ar" ? item.labelAr : item.labelEn}
              </Link>
            ))}
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "الأقسام" : "Menu"}
            </p>
            {menuSections.map((section) => (
              <span key={section.id} className="block text-[color:var(--v3-muted)]">
                {section.title}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "تابعنا" : "Follow Us"}
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                aria-label="Instagram"
                className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--v3-cream)] bg-white text-[color:var(--v3-accent)] shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.6">
                  <rect x="3" y="3" width="18" height="18" rx="5" />
                  <circle cx="12" cy="12" r="4" />
                  <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                </svg>
              </a>
              <a
                href="#"
                aria-label="Facebook"
                className="grid h-10 w-10 place-items-center rounded-full border border-[color:var(--v3-cream)] bg-white text-[color:var(--v3-accent)] shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
              >
                <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor">
                  <path d="M13.5 9.5h2.5V7h-2.5c-2 0-3.5 1.5-3.5 3.5V13H8v2.5h2v6h2.5v-6H15l.5-2.5h-3v-2.5c0-.7.3-1 1-1z" />
                </svg>
              </a>
            </div>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-10 text-center text-sm text-[color:var(--v3-muted)]">
          {lang === "ar" ? "© 2026 جميع الحقوق محفوظة" : "© 2026 All rights reserved"}
        </div>
      </footer>

      <style jsx>{`
        .editorial-scroll {
          scroll-snap-type: x mandatory;
          scrollbar-width: none;
        }
        .editorial-scroll::-webkit-scrollbar {
          display: none;
        }
        .editorial-card {
          scroll-snap-align: start;
        }
        .carousel-shell {
          position: relative;
        }
        .carousel-edge {
          pointer-events: none;
          position: absolute;
          top: 0;
          bottom: 0;
          width: 72px;
          z-index: 5;
          background: linear-gradient(
            90deg,
            var(--v3-cream) 0%,
            rgba(248, 244, 238, 0) 100%
          );
        }
        .carousel-edge-right {
          right: 0;
          transform: scaleX(-1);
        }
        .carousel-edge-left {
          left: 0;
        }
        .carousel-track {
          scroll-padding-inline: 56px;
        }
        .menu-v3-dark .editorial-card {
          background: rgba(19, 21, 20, 0.9);
          border-color: rgba(255, 255, 255, 0.08);
        }
        .menu-v3-dark .carousel-shell {
          background: rgba(18, 19, 18, 0.82);
          border-color: rgba(255, 255, 255, 0.08);
        }
        .menu-v3-dark .carousel-arrow {
          background: rgba(18, 19, 18, 0.9);
          border-color: rgba(255, 255, 255, 0.08);
        }
        .menu-v3-dark .carousel-edge {
          background: linear-gradient(
            90deg,
            #141615 0%,
            rgba(20, 22, 21, 0) 100%
          );
        }
        .offer-hero-gradient {
          background: linear-gradient(
            180deg,
            rgba(0, 0, 0, 0.05) 0%,
            rgba(0, 0, 0, 0.4) 100%
          );
        }
        .menu-v3-dark .offer-hero {
          background: rgba(19, 21, 20, 0.9);
          border-color: rgba(255, 255, 255, 0.08);
        }
        .menu-v3-dark .offer-hero div.bg-white\/90,
        .menu-v3-dark .offer-row {
          background: rgba(18, 19, 18, 0.85);
        }
        .menu-v3-dark .offer-row {
          border-color: rgba(255, 255, 255, 0.08);
        }
        @media (max-width: 480px) {
          .editorial-card {
            min-width: 220px;
          }
        }
      `}</style>
      <style jsx global>{`
        .menu-v3-skin {
          background: var(--v3-cream) !important;
          color: var(--v3-ink);
          overflow-x: hidden;
          scroll-behavior: smooth;
          scroll-padding-top: 96px;
        }
        .menu-v3-item-row:hover {
          background: rgba(255, 255, 255, 0.7);
        }
        .menu-v3-dark .menu-v3-item-row:hover {
          background: rgba(255, 255, 255, 0.08);
        }
      `}</style>
    </div>
  );
}
