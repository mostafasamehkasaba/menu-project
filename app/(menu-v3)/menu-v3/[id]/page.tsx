"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Amiri, Cormorant_Garamond } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../../lib/i18n";
import { useLanguage } from "../../../components/language-provider";
import type { MenuItem } from "../../../lib/menu-data";
import { menuV3Items } from "../data";
import { addToCart } from "../cart-store";

const amiri = Amiri({
  subsets: ["arabic", "latin"],
  weight: ["400", "700"],
});

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MenuV3ItemPage() {
  const params = useParams();
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

  useEffect(() => {
    const className = "menu-v3-skin";
    document.body.classList.add(className);
    document.documentElement.classList.add(className);
    return () => {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);
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
  };

  if (isLoading) {
    return (
      <div
        className={`${amiri.className} min-h-screen bg-[#f8f4ee] text-[#2a2f2c]`}
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
        className={`${amiri.className} min-h-screen bg-[#f8f4ee] text-[#2a2f2c]`}
        dir={dir}
      >
        <div className="mx-auto max-w-3xl px-4 py-16 text-center">
          <h1 className={`text-2xl font-semibold ${cormorant.className}`}>
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
      className={`${amiri.className} min-h-screen text-[16px] sm:text-[18px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={
        {
          "--v3-cream": "#f8f4ee",
          "--v3-ink": "#2a2f2c",
          "--v3-muted": "#7a6f65",
          "--v3-accent": "#b85d3d",
        } as CSSProperties
      }
    >
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(70%_40%_at_15%_0%,#fff2e8_0%,rgba(255,242,232,0)_60%),radial-gradient(80%_45%_at_85%_0%,#e9f2ee_0%,rgba(233,242,238,0)_65%),linear-gradient(180deg,#f8f4ee_0%,#f3ede7_55%,#efe7df_100%)]" />

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <Link
            href="/menu-v3"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
          >
            {lang === "ar" ? "العودة للمنيو" : "Back to Menu"}
          </Link>
          <div className="flex items-center gap-3">
            <Link
              href="/menu-v3/cart"
              className="grid h-10 w-10 place-items-center rounded-full bg-white text-base text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
              aria-label={t("cart")}
              title={t("cart")}
            >
              🛒
            </Link>
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

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:gap-8">
          <div className="overflow-hidden rounded-[32px] bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={item.image}
              alt={getLocalizedText(item.name, lang)}
              className="h-72 w-full object-cover"
              loading="lazy"
            />
            <div className="space-y-2 px-6 pb-6 pt-5 text-sm">
              <h1 className={`text-2xl font-semibold ${cormorant.className}`}>
                {getLocalizedText(item.name, lang)}
              </h1>
              <p className="text-[color:var(--v3-muted)]">
                {getLocalizedText(item.desc, lang)}
              </p>
            </div>
          </div>

          <div className="space-y-6 rounded-[32px] bg-white/85 px-5 py-6 shadow-[0_18px_32px_rgba(15,23,42,0.12)] sm:px-6">
            <div className="flex items-center justify-between">
              <h2 className={`text-lg font-semibold ${cormorant.className}`}>
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
                <div className="space-y-3">
                  {extras.map((extra) => (
                    <label
                      key={extra.id}
                      className="flex items-center justify-between rounded-2xl border border-[color:var(--v3-cream)] bg-white px-4 py-3 text-sm"
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
                className="h-24 w-full rounded-2xl border border-[color:var(--v3-cream)] px-4 py-3 text-sm outline-none focus:border-[color:var(--v3-accent)]"
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
