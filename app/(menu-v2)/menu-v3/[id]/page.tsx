"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Tajawal, Playfair_Display } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../../lib/i18n";
import { useLanguage } from "../../../components/language-provider";
import {
  applyMenuTheme,
  getMenuTheme,
  setMenuTheme,
  type MenuTheme,
} from "../../../lib/menu-theme";
import type { MenuItem } from "../../../lib/menu-data";
import { menuV3Items } from "../data";
import { addToCart } from "../cart-store";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MenuV3ItemPage() {
  const params = useParams();
  const router = useRouter();
  const { dir, lang, t, toggleLang } = useLanguage();
  const idValue = Array.isArray(params.id) ? params.id[0] : params.id;
  const itemId = Number(idValue);
  const [item, setItem] = useState<MenuItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedExtras, setSelectedExtras] = useState<Record<string, boolean>>(
    {}
  );
  const [cartToast, setCartToast] = useState<{
    total: number;
    count: number;
  } | null>(null);
  const [theme, setTheme] = useState<MenuTheme>("light");

  const headingFont = lang === "ar" ? tajawal.className : playfair.className;

  const extras = useMemo(() => item?.extras ?? [], [item]);
  const extrasTotal = useMemo(
    () =>
      extras.reduce(
        (sum, extra) => sum + (selectedExtras[extra.id] ? extra.price : 0),
        0
      ),
    [extras, selectedExtras]
  );
  const unitPrice = item ? item.price + extrasTotal : 0;
  const totalPrice = unitPrice * quantity;

  const themeVars = useMemo(
    () =>
      ({
        "--v3-cream": theme === "dark" ? "#141615" : "#f8f4ee",
        "--v3-ink": theme === "dark" ? "#f4efe7" : "#2a2f2c",
        "--v3-muted": theme === "dark" ? "#c5b8ab" : "#7a6f65",
        "--v3-accent": theme === "dark" ? "#e18b6b" : "#b85d3d",
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
    if (!cartToast) {
      return;
    }
    const timer = window.setTimeout(() => setCartToast(null), 2200);
    return () => window.clearTimeout(timer);
  }, [cartToast]);

  useEffect(() => {
    let mounted = true;
    const loadItem = async () => {
      if (!Number.isFinite(itemId)) {
        setItem(null);
        setIsLoading(false);
        return;
      }
      const apiItem = menuV3Items.find((entry) => entry.id === itemId) ?? null;
      if (!mounted) {
        return;
      }
      setItem(apiItem);
      setIsLoading(false);
    };
    loadItem();
    return () => {
      mounted = false;
    };
  }, [itemId]);

  const handleAddToCart = () => {
    if (!item) {
      return;
    }
    const items = addToCart(
      {
        id: item.id,
        name: getLocalizedText(item.name, lang),
        price: unitPrice,
        image: item.image,
      },
      quantity
    );
    const total = items.reduce((sum, entry) => sum + entry.price * entry.qty, 0);
    const count = items.reduce((sum, entry) => sum + entry.qty, 0);
    setCartToast({ total, count });
    router.push("/menu-v3/cart");
  };

  if (isLoading) {
    return (
      <div
        className={`${headingFont} min-h-screen bg-[#f8f4ee] text-[#2a2f2c]`}
        dir={dir}
      >
        <div className="mx-auto max-w-4xl px-4 py-16 text-center">
          <div className="text-sm text-slate-500">Loading...</div>
        </div>
      </div>
    );
  }

  if (!item) {
    return (
      <div
        className={`${headingFont} min-h-screen bg-[#f8f4ee] text-[#2a2f2c]`}
        dir={dir}
      >
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className={`text-2xl font-semibold ${headingFont}`}>
            {t("productNotFound")}
          </h1>
          <Link
            href="/menu-v3"
            className="mt-6 inline-flex rounded-full bg-[#b85d3d] px-6 py-3 text-sm font-semibold text-white"
          >
            {t("backToMenu")}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`${headingFont} min-h-screen flex flex-col text-[17px] sm:text-[19px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={themeVars}
    >
      <div className="absolute inset-0 -z-10" style={{ background: "var(--v3-bg)" }} />

      <div className="flex-1">
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/70 bg-[color:var(--v3-cream)]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
            <Link
              href="/menu-v3"
              className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            >
              {lang === "ar" ? "العودة للمنيو" : "Back to Menu"}
            </Link>
            <nav className={`hidden items-center gap-6 text-sm font-semibold text-[color:var(--v3-muted)] lg:flex ${headingFont}`}>
              <a href="/menu-v3#home" className="hover:text-[color:var(--v3-accent)]">
                {lang === "ar" ? "الرئيسية" : "Home"}
              </a>
              <a href="/menu-v3#menu" className="hover:text-[color:var(--v3-accent)]">
                {lang === "ar" ? "المنيو" : "Menu"}
              </a>
              <a href="/menu-v3#sections" className="hover:text-[color:var(--v3-accent)]">
                {lang === "ar" ? "الأقسام" : "Sections"}
              </a>
              <a href="/menu-v3#contact" className="hover:text-[color:var(--v3-accent)]">
                {lang === "ar" ? "تواصل" : "Contact"}
              </a>
            </nav>
            <div className="flex items-center gap-3">
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
              <button
                type="button"
                onClick={toggleLang}
                className="h-10 w-10 rounded-full bg-white text-sm font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
                aria-label={t("language")}
                title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
              >
                {lang === "ar" ? "EN" : "AR"}
              </button>
            </div>
          </header>

          <section className="mt-6 grid items-start gap-6 lg:grid-cols-[1fr_1fr] lg:gap-8">
            <div className="mt-[30px] self-start overflow-hidden rounded-[28px] bg-white shadow-[0_18px_32px_rgba(15,23,42,0.12)]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={item.image}
                alt={getLocalizedText(item.name, lang)}
                className="h-56 w-full object-cover sm:h-64"
                loading="lazy"
              />
              <div className="mt-[30px] space-y-1 px-5 pb-5 pt-4 text-sm">
                <h1 className={`text-2xl font-semibold ${headingFont}`}>
                  {getLocalizedText(item.name, lang)}
                </h1>
                <p className="text-[color:var(--v3-muted)]">
                  {getLocalizedText(item.desc, lang)}
                </p>
              </div>
            </div>

            <div className="space-y-5 rounded-[28px] bg-white/85 px-5 py-5 shadow-[0_18px_32px_rgba(15,23,42,0.12)] sm:px-6">
              <div className="flex items-center justify-between">
                <h2 className={`text-lg font-semibold ${headingFont}`}>
                  {lang === "ar" ? "تفاصيل الطلب" : "Order Details"}
                </h2>
                <span className="text-base font-semibold text-[color:var(--v3-accent)]">
                  {formatCurrency(totalPrice, lang)}
                </span>
              </div>

              {extras.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                    {t("extras")}
                  </p>
                <div className="space-y-2">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--v3-cream)] bg-white px-4 py-2 text-sm"
                    >
                        <span className="text-[color:var(--v3-ink)]">
                          {getLocalizedText(extra.label, lang)}
                        </span>
                        <div className="flex items-center gap-3">
                          <span className="text-[color:var(--v3-accent)]">
                            {formatCurrency(extra.price, lang)}+
                          </span>
                          <input
                            type="checkbox"
                            checked={Boolean(selectedExtras[extra.id])}
                            onChange={() =>
                              setSelectedExtras((prev) => ({
                                ...prev,
                                [extra.id]: !prev[extra.id],
                              }))
                            }
                            className="h-5 w-5 rounded border-slate-300"
                          />
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
              ) : null}

            <div className="space-y-3">
              <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                {t("notes")}
              </p>
              <textarea
                placeholder={t("addNotesHere")}
                className="h-20 w-full rounded-2xl border border-[color:var(--v3-cream)] px-4 py-3 text-sm outline-none focus:border-[color:var(--v3-accent)]"
              />
            </div>

              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                  {t("quantity")}
                </p>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => Math.max(1, prev - 1))}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--v3-cream)] text-lg text-[color:var(--v3-muted)]"
                  >
                    -
                  </button>
                  <span className="text-base font-semibold">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((prev) => prev + 1)}
                    className="flex h-10 w-10 items-center justify-center rounded-full bg-[color:var(--v3-accent)] text-lg text-white"
                  >
                    +
                  </button>
                </div>
              </div>

              <div
                className={`mt-4 flex flex-wrap items-center justify-between gap-3 ${
                  dir === "rtl" ? "flex-row-reverse" : "flex-row"
                }`}
              >
                <span className="text-base font-semibold text-[color:var(--v3-accent)]">
                  {formatCurrency(totalPrice, lang)}
                </span>
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="rounded-full bg-[color:var(--v3-accent)] px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.3)]"
                >
                  {t("addToCart")}
                </button>
              </div>
            </div>
          </section>
        </div>
      </div>

      {cartToast ? (
        <div className="fixed bottom-24 left-6">
          <div
            className={`flex items-center gap-3 rounded-full bg-[color:var(--v3-accent)] px-4 py-2 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(184,93,61,0.35)] ${
              dir === "rtl" ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <span>{formatCurrency(cartToast.total, lang, 0)}</span>
            <span className="opacity-90">{t("cart")}</span>
            <span className="grid h-6 w-6 place-items-center rounded-full bg-white/20 text-xs">
              {cartToast.count}
            </span>
          </div>
        </div>
      ) : null}

      <footer
        id="contact"
        className="mt-12 w-full border-y border-white/60 bg-white/85 shadow-[0_18px_32px_rgba(184,93,61,0.1)] backdrop-blur"
      >
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 text-base md:grid-cols-2 lg:grid-cols-4">
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
            <a href="/menu-v3" className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "الرئيسية" : "Home"}
            </a>
            <a href="/menu-v3#menu" className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "المنيو" : "Menu"}
            </a>
            <a href="/menu-v3#contact" className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "تواصل" : "Contact"}
            </a>
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "الأقسام" : "Menu"}
            </p>
            <span className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "مقبلات" : "Appetizers"}
            </span>
            <span className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "وجبات رئيسية" : "Mains"}
            </span>
            <span className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "مشروبات" : "Drinks"}
            </span>
            <span className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "حلويات" : "Desserts"}
            </span>
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
        <div className="mx-auto max-w-5xl px-6 pb-10 text-center text-sm text-[color:var(--v3-muted)]">
          {lang === "ar" ? "© 2026 جميع الحقوق محفوظة" : "© 2026 All rights reserved"}
        </div>
      </footer>

      <style jsx global>{`
        .menu-v3-skin {
          background: var(--v3-cream) !important;
          color: var(--v3-ink);
          overflow-x: hidden;
        }
      `}</style>
    </div>
  );
}
