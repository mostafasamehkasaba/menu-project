"use client";

import { Suspense, useEffect, useMemo, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Amiri, Cairo } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { getStoredTable, parseTableParam, setStoredTable } from "../../lib/table";
import { useLanguage } from "../../components/language-provider";
import ChatbotSection from "../../components/chatbot-section";
import type { MenuItem } from "../../lib/menu-data";
import { menuV2Catalog, type MenuCatalog } from "./data";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const navItems = [
  { id: "home", labelAr: "الرئيسية", labelEn: "Home" },
  { id: "menu", labelAr: "المنيو", labelEn: "Menu" },
  { id: "culture", labelAr: "ثقافتنا", labelEn: "Our Culture" },
  { id: "contact", labelAr: "تواصل", labelEn: "Contact" },
];

type MenuSection = {
  id: string;
  title: string;
  items: MenuItem[];
};

const fallbackHeroItems: MenuItem[] = [
  {
    id: -1,
    name: { ar: "طبق مميز", en: "Signature Dish" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: -2,
    name: { ar: "وجبة صحية", en: "Healthy Bowl" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: -3,
    name: { ar: "ستيك مشوي", en: "Grilled Steak" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: -4,
    name: { ar: "باستا", en: "Pasta" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: -5,
    name: { ar: "طبق بحري", en: "Seafood" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: -6,
    name: { ar: "سلطة", en: "Salad" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: -7,
    name: { ar: "طبق شرقي", en: "Oriental Dish" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1525755662778-989d0524087e?auto=format&fit=crop&w=600&q=80",
  },
  {
    id: -8,
    name: { ar: "مشويات", en: "Grill" },
    desc: { ar: "", en: "" },
    price: 0,
    category: "all",
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=600&q=80",
  },
];

function MenuV2Content() {
  const { dir, lang, t, toggleLang } = useLanguage();
  const searchParams = useSearchParams();
  const [catalog] = useState<MenuCatalog>(menuV2Catalog);
  const [showCallWaiterModal, setShowCallWaiterModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [isSendingCall, setIsSendingCall] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);

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

  useEffect(() => {
    const className = "menu-v2-skin";
    document.body.classList.add(className);
    document.documentElement.classList.add(className);
    return () => {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);
    };
  }, []);

  const tableNumber = useMemo(() => {
    const tableParam =
      searchParams.get("table") ||
      searchParams.get("table_id") ||
      searchParams.get("t");
    const parsed = parseTableParam(tableParam);
    if (parsed) {
      return parsed;
    }
    const fromTable = searchParams.get("from") === "table";
    if (fromTable) {
      return getStoredTable();
    }
    return null;
  }, [searchParams]);

  useEffect(() => {
    const tableParam =
      searchParams.get("table") ||
      searchParams.get("table_id") ||
      searchParams.get("t");
    const parsed = parseTableParam(tableParam);
    if (parsed) {
      setStoredTable(parsed);
      return;
    }
    const fromTable = searchParams.get("from") === "table";
    if (fromTable) {
      return;
    }
    setStoredTable(null);
  }, [searchParams]);

  useEffect(() => {
    if (!callNotice) {
      return;
    }
    const timeout = window.setTimeout(() => {
      setCallNotice(null);
    }, 3500);
    return () => window.clearTimeout(timeout);
  }, [callNotice]);

  // static data only for v2

  const callReasons = [
    { id: "needBill", icon: "🧾" },
    { id: "needHelp", icon: "🆘" },
    { id: "additionalOrder", icon: "➕" },
    { id: "orderIssue", icon: "⚠️" },
  ] as const;

  const handleSendCall = async () => {
    if (!selectedReason) {
      return;
    }
    if (!tableNumber) {
      setCallError(t("callWaiterTableMissing"));
      return;
    }
    setIsSendingCall(true);
    setCallError(null);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setShowCallWaiterModal(false);
    setSelectedReason(null);
    setCallNotice(t("callWaiterSuccess"));
    setIsSendingCall(false);
  };

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

  const featuredItems = useMemo<MenuItem[]>(() => {
    return catalog.items.slice(0, 9);
  }, [catalog.items]);

  const menuSections = useMemo<MenuSection[]>(() => {
    const categories = catalog.categories.filter((item) => item.id !== "all");
    const base = categories.length
      ? categories.slice(0, 3)
      : [{ id: "all", label: { ar: "المنيو", en: "Menu" }, icon: "✦" }];
    return base.map((category) => {
      const matched = catalog.items.filter(
        (item) => item.category === category.id
      );
      const items = matched.length ? matched.slice(0, 6) : catalog.items.slice(0, 6);
      return {
        id: category.id,
        title:
          lang === "ar"
            ? `${getLocalizedText(category.label, lang)} الخاصة`
            : `${getLocalizedText(category.label, lang)} Special Menu`,
        items,
      };
    });
  }, [catalog.categories, catalog.items, lang]);

  const cultureImages = useMemo<MenuItem[]>(() => {
    const pool = catalog.items.slice(0, 8);
    return pool.length ? pool : catalog.items;
  }, [catalog.items]);

  if (!isRestaurantOpen) {
    return (
      <div
        className={`${cairo.className} min-h-screen bg-[#f7f3ee] text-[#2b3a33]`}
        dir={dir}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-[32px] bg-white px-6 py-10 text-center shadow-[0_24px_50px_rgba(15,23,42,0.15)]">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600 text-2xl">
              !
            </div>
            <h2 className={`mt-4 text-xl font-semibold ${amiri.className}`}>
              {lang === "ar" ? "المطعم مغلق الآن" : "Restaurant is closed now"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {lang === "ar"
                ? "يرجى المحاولة لاحقًا."
                : "Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${amiri.className} min-h-screen flex flex-col text-[17px] text-[color:var(--menu-ink)]`}
      dir={dir}
      style={
        {
          "--menu-cream": "#f7f3ee",
          "--menu-cream-strong": "#e5d8cb",
          "--menu-ink": "#2b3a33",
          "--menu-muted": "#7d7064",
          "--menu-accent": "#b05a3a",
          "--menu-sun": "#d9a153",
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_45%_at_12%_0%,#fff4ec_0%,rgba(255,244,236,0)_60%),radial-gradient(80%_50%_at_88%_0%,#e9f2ee_0%,rgba(233,242,238,0)_65%),linear-gradient(180deg,#f7f3ee_0%,#f3ede6_55%,#efe7df_100%)]" />
      <div className="pointer-events-none absolute left-12 top-24 -z-10 h-52 w-52 rounded-full bg-[#eadfd4] blur-3xl" />
      <div className="pointer-events-none absolute right-10 top-40 -z-10 h-60 w-60 rounded-full bg-[#e2eee8] blur-3xl" />

      <div className="flex-1">
        <div className="mx-auto max-w-6xl px-4 pb-12 pt-6 sm:px-6 lg:px-8">
        <header id="home" className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-full bg-[color:var(--menu-accent)] text-white shadow-[0_10px_20px_rgba(176,90,58,0.25)]">
              ل
            </div>
            <div className="text-right">
              <p className={`text-sm font-semibold ${amiri.className}`}>
                {t("restaurantName")}
              </p>
              <p className="text-xs text-[color:var(--menu-muted)]">
                {lang === "ar" ? "قائمة المذاق الفاخر" : "Fine Dining Menu"}
              </p>
            </div>
          </div>

          <nav className="hidden items-center gap-6 text-sm font-semibold text-[color:var(--menu-muted)] lg:flex">
            {navItems.map((item) => (
              <a key={item.id} href={`#${item.id}`} className="hover:text-[color:var(--menu-accent)]">
                {lang === "ar" ? item.labelAr : item.labelEn}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="h-10 w-10 rounded-full bg-white text-sm font-semibold text-[color:var(--menu-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
              aria-label={t("language")}
              title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
            >
              {lang === "ar" ? "EN" : "AR"}
            </button>
            <Link
              href="/cart"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-base text-[color:var(--menu-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
              aria-label={t("cart")}
              title={t("cart")}
            >
              🛒
            </Link>
            <a
              href="tel:0555000111"
              className="rounded-full border border-white/70 bg-white/70 px-4 py-2 text-xs font-semibold text-[color:var(--menu-accent)] shadow-[0_10px_18px_rgba(15,23,42,0.08)]"
            >
              0555-000-111
            </a>
          </div>
        </header>

        <section className="mt-8 rounded-[34px] border border-white/70 bg-white/75 px-5 py-7 text-center shadow-[0_24px_50px_rgba(15,23,42,0.12)] backdrop-blur sm:px-8">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--menu-accent)]">
            {lang === "ar" ? "تجربة المذاق الراقي" : "A refined dining experience"}
          </p>
          <h1 className={`mt-4 text-3xl font-semibold sm:text-4xl ${amiri.className}`}>
            {lang === "ar"
              ? "اغمس في عالم الأطباق الشهية"
              : "Dive Into Delicious Meal Dishes"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--menu-muted)]">
            {lang === "ar"
              ? "مجموعة مختارة من أطباقنا المميزة مع تقديم أنيق ومكونات طازجة."
              : "A curated selection of signature dishes crafted with fresh ingredients."}
          </p>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-semibold text-[color:var(--menu-muted)]">
            <span className="rounded-full bg-[color:var(--menu-cream)] px-4 py-2">
              {lang === "ar" ? "مكونات طازجة" : "Fresh ingredients"}
            </span>
            <span className="rounded-full bg-[color:var(--menu-cream)] px-4 py-2">
              {lang === "ar" ? "تقديم فاخر" : "Elegant plating"}
            </span>
            <span className="rounded-full bg-[color:var(--menu-cream)] px-4 py-2">
              {lang === "ar" ? "قائمة موسمية" : "Seasonal menu"}
            </span>
          </div>
        </section>

        <section className="mt-10">
          <div className="relative hero-marquee-wrap">
              <div className={`hero-marquee ${dir === "rtl" ? "hero-marquee-rtl" : "hero-marquee-ltr"}`}>
                {[...heroImages, ...heroImages].map((item, index) => (
                  <div
                    key={`${item.id}-${index}`}
                    className="hero-card overflow-hidden rounded-[22px] bg-white shadow-[0_14px_24px_rgba(15,23,42,0.12)]"
                    style={
                      {
                        "--tilt": index % 2 === 0 ? "-3deg" : "3deg",
                      } as CSSProperties
                    }
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

        <div className="mt-12 border-t border-dashed border-[color:var(--menu-cream-strong)]" />

        <section id="menu" className="mt-10 space-y-12">
          {menuSections.map((section) => (
            <div key={section.id} className="space-y-6">
              <div className="text-center">
                <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white text-[color:var(--menu-accent)] shadow-[0_10px_16px_rgba(15,23,42,0.12)]">
                  ✿
                </div>
                <h2 className={`text-2xl font-semibold ${amiri.className}`}>
                  {section.title}
                </h2>
              </div>

              <div className="rounded-[32px] border border-white/60 bg-white/80 px-5 py-6 shadow-[0_18px_35px_rgba(15,23,42,0.1)]">
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
                          <p className={`text-sm font-semibold ${amiri.className}`}>
                            {getLocalizedText(item.name, lang)}
                          </p>
                          <span className="flex-1 border-b border-dotted border-[color:var(--menu-cream-strong)]" />
                          <span className="text-sm font-semibold text-[color:var(--menu-accent)]">
                            {formatCurrency(item.price, lang)}
                          </span>
                        </div>
                        <p className="text-xs text-[color:var(--menu-muted)]">
                          {getLocalizedText(item.desc, lang)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 flex justify-center">
                  <Link
                    href="/book"
                    className="rounded-full bg-[color:var(--menu-accent)] px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(176,90,58,0.35)]"
                  >
                    {lang === "ar" ? "احجز طاولة" : "Book a Table"}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section id="products" className="mt-14">
          <div className="text-center">
            <div className="mx-auto mb-2 grid h-10 w-10 place-items-center rounded-full bg-white text-[color:var(--menu-accent)] shadow-[0_10px_16px_rgba(15,23,42,0.12)]">
              ✦
            </div>
            <h2 className={`text-2xl font-semibold ${amiri.className}`}>
              {lang === "ar" ? "المنتجات" : "Signature Dishes"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--menu-muted)]">
              {lang === "ar"
                ? "استكشف أشهى الأطباق المتاحة اليوم."
                : "Explore today’s curated selection of dishes."}
            </p>
          </div>

          <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {featuredItems.length === 0 ? (
              <div className="col-span-full rounded-[28px] bg-white/80 px-6 py-10 text-center text-sm text-slate-500 shadow-[0_18px_32px_rgba(15,23,42,0.12)]">
                {t("emptyMenuMessage")}
              </div>
            ) : (
              featuredItems.map((item) => (
                <article
                  key={item.id}
                  className="group overflow-hidden rounded-[26px] bg-white shadow-[0_16px_30px_rgba(15,23,42,0.12)] transition hover:-translate-y-1 hover:shadow-[0_22px_36px_rgba(15,23,42,0.16)]"
                >
                  <Link href={`/menu-v2/${item.id}`} className="block">
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
                    <Link href={`/menu-v2/${item.id}`}>
                      <h3 className={`text-base font-semibold ${amiri.className}`}>
                        {getLocalizedText(item.name, lang)}
                      </h3>
                    </Link>
                    <p className="text-xs text-[color:var(--menu-muted)]">
                      {getLocalizedText(item.desc, lang)}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[color:var(--menu-accent)]">
                        {formatCurrency(item.price, lang)}
                      </span>
                      <Link
                        href={`/menu-v2/${item.id}`}
                        className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-700"
                      >
                        {lang === "ar" ? "تفاصيل" : "Details"}
                      </Link>
                    </div>
                  </div>
                </article>
              ))
            )}
          </div>
        </section>

        <section id="culture" className="mt-16">
          <div className="text-center">
            <h2 className={`text-2xl font-semibold ${amiri.className}`}>
              {lang === "ar" ? "ثقافتنا" : "Our Culture"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--menu-muted)]">
              {lang === "ar"
                ? "لمسات فنية في كل طبق وتجربة مفعمة بالشغف."
                : "Craftsmanship in every dish and a passion-filled experience."}
            </p>
          </div>

          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            {cultureImages.slice(0, 5).map((item, index) => (
              <div
                key={item.id}
                className={`overflow-hidden rounded-[24px] shadow-[0_14px_26px_rgba(15,23,42,0.12)] ${
                  index === 2 ? "h-36 w-44" : "h-28 w-32"
                }`}
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

          <div className="mt-12 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
            <div className="rounded-[32px] bg-[color:var(--menu-sun)]/90 px-6 py-8 text-white shadow-[0_20px_36px_rgba(209,162,79,0.35)]">
              <p className={`text-lg font-semibold ${amiri.className}`}>
                {lang === "ar"
                  ? "نحب هذا المكان لأنه يجمع العائلة حول تجربة مميزة بكل تفاصيلها."
                  : "We love how every visit feels curated and thoughtfully made."}
              </p>
              <div className="mt-5 flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-white text-[color:var(--menu-accent)]">
                  م
                </div>
                <div>
                  <p className="text-sm font-semibold">{lang === "ar" ? "مريم صالح" : "Mariam Saleh"}</p>
                  <p className="text-xs text-white/80">
                    {lang === "ar" ? "عميلة وفية" : "Loyal customer"}
                  </p>
                </div>
              </div>
            </div>

            <div className="rounded-[32px] bg-white p-4 shadow-[0_18px_32px_rgba(15,23,42,0.12)]">
              <div className="grid grid-cols-2 gap-3">
                {cultureImages.slice(0, 4).map((item) => (
                  <div key={item.id} className="overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={getLocalizedText(item.name, lang)}
                      className="h-28 w-full object-cover"
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        </div>
      </div>

      <footer
        id="contact"
        className="mt-10 w-full border-y border-white/60 bg-white/85 shadow-[0_18px_32px_rgba(176,90,58,0.1)] backdrop-blur"
      >
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-12 text-base md:grid-cols-4">
          <div className="space-y-3">
            <p className="text-lg font-semibold text-[color:var(--menu-ink)]">
              {lang === "ar" ? "تواصل" : "Contact"}
            </p>
            <p className="text-[color:var(--menu-muted)]">0555-000-111</p>
            <p className="text-[color:var(--menu-muted)]">
              {lang === "ar" ? "الرياض، شارع العليا" : "Riyadh, Al Olaya Street"}
            </p>
            <p className="text-[color:var(--menu-muted)]">hello@restaurant.com</p>
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[color:var(--menu-ink)]">
              {lang === "ar" ? "التنقل" : "Navigate"}
            </p>
            {navItems.map((item) => (
              <a
                key={item.id}
                href={`#${item.id}`}
                className="block text-[color:var(--menu-muted)] hover:text-[color:var(--menu-accent)]"
              >
                {lang === "ar" ? item.labelAr : item.labelEn}
              </a>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[color:var(--menu-ink)]">
              {lang === "ar" ? "أقسام المنيو" : "Menu"}
            </p>
            {menuSections.map((section) => (
              <span key={section.id} className="block text-[color:var(--menu-muted)]">
                {section.title}
              </span>
            ))}
          </div>
          <div className="space-y-2">
            <p className="text-lg font-semibold text-[color:var(--menu-ink)]">
              {lang === "ar" ? "تابعنا" : "Follow Us"}
            </p>
            <span className="block text-[color:var(--menu-muted)]">Instagram</span>
            <span className="block text-[color:var(--menu-muted)]">Facebook</span>
            <span className="block text-[color:var(--menu-muted)]">TikTok</span>
            <span className="block text-[color:var(--menu-muted)]">X</span>
          </div>
        </div>
        <div className="mx-auto max-w-6xl px-6 pb-10 text-center text-sm text-[color:var(--menu-muted)]">
          {lang === "ar"
            ? "© 2026 جميع الحقوق محفوظة"
            : "© 2026 All rights reserved"}
        </div>
      </footer>

      {callNotice ? (
        <div className="fixed bottom-28 left-1/2 z-40 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.35)]">
          {callNotice}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-20 right-6 flex items-center gap-2 rounded-full bg-[color:var(--menu-accent)] px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(176,90,58,0.25)]"
      >
        {t("talkWithUs")}
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[color:var(--menu-accent)] text-white">
          💬
        </span>
      </button>

      {tableNumber ? (
        <div className="fixed bottom-20 left-6 z-40">
          <div className="absolute -bottom-3 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-[color:var(--menu-accent)]" />
          <button
            type="button"
            onClick={() => {
              setCallError(null);
              setSelectedReason(null);
              setShowCallWaiterModal(true);
            }}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-[color:var(--menu-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
            aria-label={t("callWaiterTitle")}
          >
            🛎️
          </button>
        </div>
      ) : null}

      {showChatbot ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--menu-accent)]/20 px-4">
          <div className="relative w-full max-w-4xl">
            <button
              type="button"
              onClick={() => setShowChatbot(false)}
              className="absolute right-3 top-3 z-10 rounded-full bg-white p-2 text-lg text-slate-700 shadow-lg"
              aria-label={t("cancel")}
            >
              ×
            </button>
            <ChatbotSection />
          </div>
        </div>
      ) : null}

      {showCallWaiterModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[color:var(--menu-accent)]/15 px-4">
          <div className="w-full max-w-md rounded-[28px] bg-white px-6 py-7 shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => {
                  setShowCallWaiterModal(false);
                  setSelectedReason(null);
                  setCallError(null);
                }}
                className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-100 text-slate-500"
                aria-label={t("cancel")}
              >
                ✕
              </button>
              <h3 className={`text-lg font-semibold ${amiri.className}`}>
                {t("callWaiterTitle")}
              </h3>
              <div className="h-10 w-10" aria-hidden="true" />
            </div>

            <p className="mt-4 text-center text-sm text-slate-500">
              {t("selectReason")}
            </p>

            <div className="mt-4 space-y-3">
              {callReasons.map((reason) => {
                const isSelected = selectedReason === reason.id;
                return (
                  <button
                    key={reason.id}
                    type="button"
                    onClick={() => setSelectedReason(reason.id)}
                    className={`flex w-full items-center justify-between rounded-2xl border px-4 py-3 text-sm font-semibold transition ${
                      isSelected
                        ? "border-[color:var(--menu-accent)] bg-[color:var(--menu-cream)] text-[color:var(--menu-accent)]"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>{t(reason.id)}</span>
                    <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-base">
                      {reason.icon}
                    </span>
                  </button>
                );
              })}
            </div>

            {callError ? (
              <div className="mt-4 rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-center text-xs font-semibold text-rose-600">
                {callError}
              </div>
            ) : null}

            <button
              type="button"
              disabled={!selectedReason || isSendingCall}
              onClick={handleSendCall}
              className={`mt-6 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(176,90,58,0.25)] ${
                selectedReason && !isSendingCall
                  ? "bg-[color:var(--menu-accent)]"
                  : "cursor-not-allowed bg-[color:var(--menu-accent)]/50"
              }`}
            >
              {isSendingCall ? t("sending") : t("send")}
            </button>
          </div>
        </div>
      ) : null}
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
          height: 120px;
          width: 170px;
          transform: rotate(var(--tilt));
          transform-origin: center;
          border: 1px solid rgba(255, 255, 255, 0.7);
          box-shadow: 0 16px 28px rgba(43, 58, 51, 0.12);
        }
        @media (min-width: 640px) {
          .hero-card {
            height: 140px;
            width: 200px;
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
        .menu-v2-skin {
          background: #f7f3ee !important;
          color: #2b3a33;
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}

export default function MenuV2Page() {
  return (
    <Suspense fallback={null}>
      <MenuV2Content />
    </Suspense>
  );
}

