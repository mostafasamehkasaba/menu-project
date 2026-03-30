"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { Tajawal, Playfair_Display } from "next/font/google";
import { formatCurrency } from "../../../lib/i18n";
import { useLanguage } from "../../../components/language-provider";
import {
  applyMenuTheme,
  getMenuTheme,
  setMenuTheme,
  type MenuTheme,
} from "../../../lib/menu-theme";
import {
  getCartItems,
  removeCartItem,
  updateCartItem,
  type CartItem,
} from "../cart-store";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

export default function MenuV3CartPage() {
  const { dir, lang, t } = useLanguage();
  const [items, setItems] = useState<CartItem[]>([]);
  const [theme, setTheme] = useState<MenuTheme>("light");
  const [showPayment, setShowPayment] = useState(false);
  const [paymentStep, setPaymentStep] = useState<1 | 2 | 3>(1);
  const [paymentMethod, setPaymentMethod] = useState<"CARD" | "CASH" | "ONLINE">(
    "CARD"
  );
  const [cardName, setCardName] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [showGateway, setShowGateway] = useState(false);
  const [gatewayProvider, setGatewayProvider] = useState<"VISA" | "MEEZA" | "FAWRY">("MEEZA");
  const [gatewayEmail, setGatewayEmail] = useState("");
  const [gatewayPhone, setGatewayPhone] = useState("");
  const [gatewayRef, setGatewayRef] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  useEffect(() => {
    const className = "menu-v3-skin";
    document.body.classList.add(className);
    document.documentElement.classList.add(className);
    const storedTheme = getMenuTheme();
    setTheme(storedTheme);
    applyMenuTheme(storedTheme);
    setItems(getCartItems());
    return () => {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);
      document.body.classList.remove("menu-v3-dark");
      document.documentElement.classList.remove("menu-v3-dark");
    };
  }, []);

  const totals = useMemo(() => {
    const total = items.reduce((sum, item) => sum + item.price * item.qty, 0);
    const count = items.reduce((sum, item) => sum + item.qty, 0);
    return { total, count };
  }, [items]);

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

  return (
    <div
      className={`${lang === "ar" ? tajawal.className : playfair.className} min-h-screen flex flex-col text-[17px] sm:text-[19px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={themeVars}
    >
      <div className="absolute inset-0 -z-10" style={{ background: "var(--v3-bg)" }} />

      <div className="flex-1">
        <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
          <header className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/70 bg-[color:var(--v3-cream)]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
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
            </div>
          </header>

          <div className="mt-6 rounded-[32px] bg-white/85 px-5 py-7 shadow-[0_18px_32px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8">
            <div className="flex items-center justify-between">
              <h1 className={`text-2xl font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
                {lang === "ar" ? "سلة الطلب" : "Your Cart"}
              </h1>
              <span className="text-sm text-[color:var(--v3-muted)]">
                {lang === "ar" ? `عدد العناصر ${totals.count}` : `${totals.count} items`}
              </span>
            </div>

            {items.length === 0 ? (
              <div className="mt-8 text-center text-sm text-[color:var(--v3-muted)]">
                {lang === "ar" ? "السلة فارغة حالياً." : "Your cart is empty."}
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-white/70 bg-white px-4 py-3 sm:flex-row sm:items-center"
                  >
                    <div className="flex items-center gap-4">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-14 w-14 rounded-2xl object-cover"
                      />
                      <div>
                        <p className={`text-base font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
                          {item.name}
                        </p>
                        <p className="text-xs text-[color:var(--v3-muted)]">
                          {formatCurrency(item.price, lang)}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <button
                        type="button"
                        onClick={() =>
                          setItems(updateCartItem(item.id, Math.max(1, item.qty - 1)))
                        }
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--v3-cream)] text-lg text-[color:var(--v3-muted)]"
                      >
                        -
                      </button>
                      <span className="text-base font-semibold">{item.qty}</span>
                      <button
                        type="button"
                        onClick={() => setItems(updateCartItem(item.id, item.qty + 1))}
                        className="flex h-9 w-9 items-center justify-center rounded-full bg-[color:var(--v3-accent)] text-lg text-white"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => setItems(removeCartItem(item.id))}
                        className="rounded-full border border-[color:var(--v3-accent)] px-3 py-1 text-xs font-semibold text-[color:var(--v3-accent)]"
                      >
                        {lang === "ar" ? "حذف" : "Remove"}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-8 flex flex-wrap items-center justify-between gap-3">
              <span className="text-base font-semibold text-[color:var(--v3-accent)]">
                {lang === "ar" ? "الإجمالي" : "Total"}: {formatCurrency(totals.total, lang)}
              </span>
              <button
                type="button"
                onClick={() => {
                  if (!items.length) return;
                  setShowPayment(true);
                  setPaymentStep(2);
                }}
                className={`rounded-full px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.3)] ${
                  items.length
                    ? "bg-[color:var(--v3-accent)]"
                    : "cursor-not-allowed bg-[color:var(--v3-accent)]/50"
                }`}
              >
                {lang === "ar" ? "تأكيد الطلب" : "Place Order"}
              </button>
            </div>
          </div>

          {showPayment ? (
            <section className="mt-8 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_20px_36px_rgba(15,23,42,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--v3-muted)]">
                    {lang === "ar" ? "خطوات الدفع" : "Payment Steps"}
                  </p>
                  <h2 className={`mt-1 text-xl font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
                    {lang === "ar" ? "إتمام الدفع بأمان" : "Secure Checkout"}
                  </h2>
                </div>
                <div className="flex items-center gap-2 text-xs font-semibold text-[color:var(--v3-muted)]">
                  {[
                    { step: 1, labelAr: "المراجعة", labelEn: "Review" },
                    { step: 2, labelAr: "الدفع", labelEn: "Payment" },
                    { step: 3, labelAr: "التأكيد", labelEn: "Done" },
                  ].map((step) => (
                    <div key={step.step} className="flex items-center gap-2">
                      <span
                        className={`grid h-8 w-8 place-items-center rounded-full text-xs font-semibold ${
                          paymentStep >= step.step
                            ? "bg-[color:var(--v3-accent)] text-white"
                            : "bg-[color:var(--v3-cream)] text-[color:var(--v3-muted)]"
                        }`}
                      >
                        {step.step}
                      </span>
                      <span className="hidden sm:inline">
                        {lang === "ar" ? step.labelAr : step.labelEn}
                      </span>
                      {step.step < 3 ? (
                        <span className="mx-1 hidden h-px w-6 bg-[color:var(--v3-cream)] sm:inline" />
                      ) : null}
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-6 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
                <div className="space-y-5">
                  <div className="rounded-3xl border border-[color:var(--v3-cream)] bg-white px-5 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                    <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                      {lang === "ar" ? "اختر وسيلة الدفع" : "Choose payment method"}
                    </p>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {[
                        { id: "CARD" as const, labelAr: "بطاقة", labelEn: "Card" },
                        { id: "CASH" as const, labelAr: "كاش", labelEn: "Cash" },
                        { id: "ONLINE" as const, labelAr: "أونلاين", labelEn: "Online" },
                      ].map((method) => (
                        <button
                          key={method.id}
                          type="button"
                          onClick={() => setPaymentMethod(method.id)}
                          className={`rounded-2xl border px-3 py-3 text-sm font-semibold transition ${
                            paymentMethod === method.id
                              ? "border-[color:var(--v3-accent)] bg-[color:var(--v3-cream)] text-[color:var(--v3-accent)]"
                              : "border-slate-200 bg-white text-[color:var(--v3-muted)]"
                          }`}
                        >
                          {lang === "ar" ? method.labelAr : method.labelEn}
                        </button>
                      ))}
                    </div>
                  </div>

                  {paymentMethod === "CARD" ? (
                    <div className="rounded-3xl border border-[color:var(--v3-cream)] bg-white px-5 py-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                      <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                        {lang === "ar" ? "بيانات البطاقة" : "Card details"}
                      </p>
                      <div className="mt-4 grid gap-4">
                        <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                          {lang === "ar" ? "اسم حامل البطاقة" : "Cardholder name"}
                          <input
                            type="text"
                            value={cardName}
                            onChange={(event) => setCardName(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                            placeholder={lang === "ar" ? "الاسم كما في البطاقة" : "Name on card"}
                          />
                        </label>
                        <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                          {lang === "ar" ? "رقم البطاقة" : "Card number"}
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(event) => setCardNumber(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                            placeholder="0000 0000 0000 0000"
                          />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                            {lang === "ar" ? "تاريخ الانتهاء" : "Expiry"}
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(event) => setCardExpiry(event.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                              placeholder="MM/YY"
                            />
                          </label>
                          <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                            {lang === "ar" ? "CVV" : "CVV"}
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(event) => setCardCvv(event.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                              placeholder="***"
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="rounded-3xl border border-[color:var(--v3-cream)] bg-white px-5 py-5 text-sm text-[color:var(--v3-muted)] shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                      {paymentMethod === "CASH"
                        ? lang === "ar"
                          ? "سيتم الدفع نقدًا عند الاستلام."
                          : "Pay with cash upon delivery."
                        : lang === "ar"
                          ? "سيتم توجيهك لبوابة الدفع الإلكترونية."
                          : "You will be redirected to the online payment gateway."}
                    </div>
                  )}

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <button
                      type="button"
                      onClick={() => setShowPayment(false)}
                      className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-[color:var(--v3-muted)]"
                    >
                      {lang === "ar" ? "رجوع" : "Back"}
                    </button>
                    {paymentMethod === "ONLINE" ? (
                      <button
                        type="button"
                        onClick={() => setShowGateway(true)}
                        className="rounded-full bg-[color:var(--v3-accent)] px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.3)]"
                      >
                        {lang === "ar" ? "الذهاب لبوابة الدفع" : "Go to Payment Gateway"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => {
                          setPaymentStep(3);
                        }}
                        className="rounded-full bg-[color:var(--v3-accent)] px-5 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.3)]"
                      >
                        {lang === "ar" ? "ادفع الآن" : "Pay now"}
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="rounded-3xl border border-[color:var(--v3-cream)] bg-white px-5 py-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                    <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                      {lang === "ar" ? "ملخص الطلب" : "Order summary"}
                    </p>
                    <div className="mt-4 space-y-2 text-sm text-[color:var(--v3-muted)]">
                      {items.map((item) => (
                        <div key={item.id} className="flex items-center justify-between">
                          <span>{item.name}</span>
                          <span>
                            {formatCurrency(item.price * item.qty, lang)}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[color:var(--v3-ink)]">
                      <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
                      <span className="text-[color:var(--v3-accent)]">
                        {formatCurrency(totals.total, lang)}
                      </span>
                    </div>
                  </div>

                  {paymentStep === 3 ? (
                    <div className="space-y-4">
                      <div className="rounded-3xl border border-emerald-100 bg-emerald-50 px-5 py-5 text-sm text-emerald-700 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                        {lang === "ar"
                          ? "تم تأكيد الدفع بنجاح. سيصلك إشعار عند تجهيز الطلب."
                          : "Payment confirmed successfully. You'll be notified when the order is ready."}
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowTracking(true)}
                        className="w-full rounded-2xl border border-[color:var(--v3-accent)] bg-white px-5 py-3 text-sm font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_20px_rgba(15,23,42,0.08)]"
                      >
                        {lang === "ar" ? "تتبع الطلب" : "Track Order"}
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          ) : null}

          {showPayment && showTracking ? (
            <section className="mt-6 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[color:var(--v3-muted)]">
                    {lang === "ar" ? "تتبع الطلب" : "Order Tracking"}
                  </p>
                  <h3 className={`mt-2 text-xl font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
                    {lang === "ar" ? "حالة الطلب الحالية" : "Current status"}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setShowTracking(false)}
                  className="rounded-full border border-slate-200 px-4 py-2 text-xs font-semibold text-[color:var(--v3-muted)]"
                >
                  {lang === "ar" ? "إخفاء" : "Hide"}
                </button>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-4">
                {[
                  { id: 1, labelAr: "تم الاستلام", labelEn: "Received" },
                  { id: 2, labelAr: "قيد التحضير", labelEn: "Preparing" },
                  { id: 3, labelAr: "في الطريق", labelEn: "On the way" },
                  { id: 4, labelAr: "تم التسليم", labelEn: "Delivered" },
                ].map((step, index) => {
                  const isActive = index <= 1;
                  return (
                    <div
                      key={step.id}
                      className={`rounded-2xl border px-4 py-4 text-center text-sm font-semibold ${
                        isActive
                          ? "border-[color:var(--v3-accent)] bg-[color:var(--v3-cream)] text-[color:var(--v3-accent)]"
                          : "border-slate-200 bg-white text-[color:var(--v3-muted)]"
                      }`}
                    >
                      {lang === "ar" ? step.labelAr : step.labelEn}
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-xs text-[color:var(--v3-muted)]">
                <span>{lang === "ar" ? "رقم الطلب" : "Order ID"}</span>
                <span className="font-semibold text-[color:var(--v3-ink)]">#RV-2026-128</span>
              </div>
            </section>
          ) : null}
        </div>
      </div>

      {showPayment && paymentMethod === "ONLINE" && showGateway ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4 backdrop-blur-sm">
          <div className="w-full max-w-3xl overflow-hidden rounded-[32px] bg-white shadow-[0_28px_60px_rgba(15,23,42,0.25)]">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 bg-[linear-gradient(120deg,#fff7f0,#fff1e6,#f8f4ee)] px-6 py-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.24em] text-[color:var(--v3-muted)]">
                  {lang === "ar" ? "بوابة الدفع" : "Payment Gateway"}
                </p>
                <h3
                  className={`mt-1 text-xl font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}
                >
                  {lang === "ar" ? "إتمام الدفع الإلكتروني" : "Complete Online Payment"}
                </h3>
              </div>
              <div className="flex items-center gap-2">
                <span className="rounded-full bg-white/70 px-3 py-1 text-xs font-semibold text-[color:var(--v3-muted)]">
                  SSL Secure
                </span>
                <button
                  type="button"
                  onClick={() => setShowGateway(false)}
                  className="rounded-full border border-slate-200 bg-white px-4 py-2 text-xs font-semibold text-[color:var(--v3-muted)]"
                >
                  {lang === "ar" ? "إغلاق" : "Close"}
                </button>
              </div>
            </div>

            <div className="grid gap-4 px-6 py-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="space-y-6">
                <div className="rounded-3xl border border-[color:var(--v3-cream)] bg-[color:var(--v3-cream)]/35 p-4">
                  <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                    {lang === "ar" ? "اختر وسيلة الدفع" : "Select provider"}
                  </p>
                  <div className="mt-4 grid gap-3 sm:grid-cols-3">
                    {[
                      { id: "VISA" as const, label: "Visa / Master" },
                      { id: "MEEZA" as const, label: "Meeza" },
                      { id: "FAWRY" as const, label: "Fawry Pay" },
                    ].map((provider) => (
                      <button
                        key={provider.id}
                        type="button"
                        onClick={() => setGatewayProvider(provider.id)}
                        className={`rounded-2xl border px-3 py-3 text-xs font-semibold transition ${
                          gatewayProvider === provider.id
                            ? "border-[color:var(--v3-accent)] bg-white text-[color:var(--v3-accent)] shadow-[0_10px_16px_rgba(184,93,61,0.15)]"
                            : "border-slate-200 bg-white text-[color:var(--v3-muted)]"
                        }`}
                      >
                        {provider.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.06)]">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                        {lang === "ar" ? "بيانات الدفع" : "Payment details"}
                      </p>
                      <p className="text-xs text-[color:var(--v3-muted)]">
                        {lang === "ar"
                          ? "أكمل البيانات لإتمام الدفع بأمان."
                          : "Complete the fields to finalize securely."}
                      </p>
                    </div>
                    <span className="rounded-full bg-[color:var(--v3-cream)] px-3 py-1 text-[11px] font-semibold text-[color:var(--v3-muted)]">
                      {gatewayProvider}
                    </span>
                  </div>

                  <div className="mt-5 grid gap-4">
                    {gatewayProvider !== "FAWRY" ? (
                      <>
                        <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                          {lang === "ar" ? "اسم حامل البطاقة" : "Cardholder name"}
                          <input
                            type="text"
                            value={cardName}
                            onChange={(event) => setCardName(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                            placeholder={lang === "ar" ? "الاسم كما في البطاقة" : "Name on card"}
                          />
                        </label>
                        <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                          {lang === "ar" ? "رقم البطاقة" : "Card number"}
                          <input
                            type="text"
                            inputMode="numeric"
                            value={cardNumber}
                            onChange={(event) => setCardNumber(event.target.value)}
                            className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                            placeholder="0000 0000 0000 0000"
                          />
                        </label>
                        <div className="grid gap-4 sm:grid-cols-2">
                          <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                            {lang === "ar" ? "تاريخ الانتهاء" : "Expiry"}
                            <input
                              type="text"
                              value={cardExpiry}
                              onChange={(event) => setCardExpiry(event.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                              placeholder="MM/YY"
                            />
                          </label>
                          <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                            {lang === "ar" ? "CVV" : "CVV"}
                            <input
                              type="password"
                              value={cardCvv}
                              onChange={(event) => setCardCvv(event.target.value)}
                              className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                              placeholder="***"
                            />
                          </label>
                        </div>
                      </>
                    ) : (
                      <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                        {lang === "ar" ? "رقم مرجع فوري" : "Fawry reference"}
                        <input
                          type="text"
                          value={gatewayRef}
                          onChange={(event) => setGatewayRef(event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                          placeholder="REF-XXXXXX"
                        />
                      </label>
                    )}
                    <div className="grid gap-4 sm:grid-cols-2">
                      <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                        {lang === "ar" ? "البريد الإلكتروني" : "Email"}
                        <input
                          type="email"
                          value={gatewayEmail}
                          onChange={(event) => setGatewayEmail(event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                          placeholder="name@email.com"
                        />
                      </label>
                      <label className="block text-xs font-semibold text-[color:var(--v3-muted)]">
                        {lang === "ar" ? "رقم الجوال" : "Phone"}
                        <input
                          type="tel"
                          value={gatewayPhone}
                          onChange={(event) => setGatewayPhone(event.target.value)}
                          className="mt-2 w-full rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                          placeholder="01xx xxx xxxx"
                        />
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-5">
                <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
                  <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                    {lang === "ar" ? "ملخص الدفع" : "Payment summary"}
                  </p>
                  <div className="mt-4 space-y-2 text-sm text-[color:var(--v3-muted)]">
                    <div className="flex items-center justify-between">
                      <span>{lang === "ar" ? "وسيلة الدفع" : "Provider"}</span>
                      <span className="font-semibold text-[color:var(--v3-ink)]">
                        {gatewayProvider}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{lang === "ar" ? "العمولة" : "Gateway fee"}</span>
                      <span>0.00</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{lang === "ar" ? "عدد العناصر" : "Items"}</span>
                      <span>{items.length}</span>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm font-semibold text-[color:var(--v3-ink)]">
                    <span>{lang === "ar" ? "الإجمالي" : "Total"}</span>
                    <span className="text-[color:var(--v3-accent)]">
                      {formatCurrency(totals.total, lang)}
                    </span>
                  </div>
                </div>

                <div className="rounded-3xl border border-[color:var(--v3-cream)] bg-[color:var(--v3-cream)]/60 p-4 text-xs text-[color:var(--v3-muted)]">
                  {lang === "ar"
                    ? "معلوماتك مشفرة بالكامل ولا يتم تخزين بيانات البطاقة."
                    : "Your data is encrypted end-to-end. Card details are not stored."}
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setShowGateway(false);
                    setPaymentStep(3);
                  }}
                  className="w-full rounded-2xl bg-[color:var(--v3-accent)] px-6 py-2.5 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(184,93,61,0.3)]"
                >
                  {lang === "ar" ? "ادفع الآن" : "Pay now"}
                </button>
                <p className="text-center text-xs text-[color:var(--v3-muted)]">
                  {lang === "ar"
                    ? "هذه بوابة دفع تجريبية لأغراض العرض."
                    : "This is a demo gateway for presentation only."}
                </p>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      <footer
        id="contact"
        className="mt-12 w-full border-y border-white/60 bg-white/85 shadow-[0_18px_32px_rgba(184,93,61,0.1)] backdrop-blur"
      >
        <div className="mx-auto grid max-w-5xl gap-8 px-6 py-12 text-base md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-3">
            <p className={`text-lg font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
              {lang === "ar" ? "تواصل" : "Contact"}
            </p>
            <p className="text-[color:var(--v3-muted)]">0555-000-111</p>
            <p className="text-[color:var(--v3-muted)]">
              {lang === "ar" ? "الرياض، شارع العليا" : "Riyadh, Al Olaya Street"}
            </p>
            <p className="text-[color:var(--v3-muted)]">hello@restaurant.com</p>
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
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
            <p className={`text-lg font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
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
            <p className={`text-lg font-semibold ${lang === "ar" ? tajawal.className : playfair.className}`}>
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


