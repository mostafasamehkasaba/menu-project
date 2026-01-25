"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import { getCartItems, type CartItem } from "../lib/cart";
import { menuItems } from "../lib/menu-data";
import { formatCurrency, getLocalizedText } from "../lib/i18n";
import { useLanguage } from "../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const TAX_RATE = 0.14;
const SERVICE_RATE = 0.12;

type ServiceType = "table" | "counter";
type PaymentMethod = "card" | "wallet" | "balance";
type WalletProvider = "orange" | "vodafone" | "instapay" | "etisalat";

type SuccessInfo = {
  orderNumber: string;
  orderTime: string;
};

export default function CheckoutPage() {
  const { dir, lang, t } = useLanguage();
  const [items] = useState<CartItem[]>(() => getCartItems());
  const [serviceType, setServiceType] = useState<ServiceType>("table");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("card");
  const [walletProvider, setWalletProvider] =
    useState<WalletProvider>("vodafone");
  const [walletPhone, setWalletPhone] = useState("");
  const [notes, setNotes] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvv, setCvv] = useState("");
  const [cardErrors, setCardErrors] = useState<{
    cardNumber?: string;
    expiry?: string;
    cvv?: string;
  }>({});
  const [successInfo, setSuccessInfo] = useState<SuccessInfo | null>(null);

  const subtotal = useMemo(
    () => items.reduce((sum, item) => sum + item.price * item.qty, 0),
    [items]
  );
  const tax = subtotal * TAX_RATE;
  const service = subtotal * SERVICE_RATE;
  const total = subtotal + tax + service;

  const resolveItemName = (item: CartItem) => {
    const match = menuItems.find((entry) => entry.id === item.id);
    return match ? getLocalizedText(match.name, lang) : item.name;
  };

  const handlePayNow = () => {
    if (items.length === 0) {
      return;
    }

    if (paymentMethod === "card") {
      const nextErrors: {
        cardNumber?: string;
        expiry?: string;
        cvv?: string;
      } = {};

      if (!cardNumber.trim()) {
        nextErrors.cardNumber = t("requiredField");
      }
      if (!expiry.trim()) {
        nextErrors.expiry = t("requiredField");
      }
      if (!cvv.trim()) {
        nextErrors.cvv = t("requiredField");
      }

      if (Object.keys(nextErrors).length > 0) {
        setCardErrors(nextErrors);
        return;
      }

      setCardErrors({});
    }

    const now = new Date();
    setSuccessInfo({
      orderNumber: `ORD${now.getTime()}`,
      orderTime: now.toLocaleTimeString(lang === "ar" ? "ar-EG" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    });
  };

  const backIcon = dir === "rtl" ? "→" : "←";
  const textAlign = dir === "rtl" ? "text-end" : "text-start";

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-3xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between">
          <Link
            href="/cart"
            className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-orange-500 shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            aria-label={t("backToCart")}
          >
            {backIcon}
          </Link>
          <h1 className="text-lg font-semibold sm:text-xl">
            {t("checkout")}
          </h1>
          <span className="h-10 w-10" aria-hidden="true" />
        </header>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-6">
          <h2 className="text-sm font-semibold text-slate-700">
            {t("serviceType")}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {[
              { id: "table", label: t("serveToTable"), icon: "♡" },
              { id: "counter", label: t("pickupFromCounter"), icon: "🧾" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setServiceType(option.id as ServiceType)}
                className={`flex items-center justify-center gap-2 rounded-2xl border px-4 py-4 text-sm font-semibold ${
                  serviceType === option.id
                    ? "border-orange-400 bg-orange-50 text-orange-600"
                    : "border-slate-200 text-slate-600"
                }`}
              >
                <span className="text-lg">{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-6">
          <h2 className="text-sm font-semibold text-slate-700">
            {t("orderSummary")}
          </h2>
          <div className="mt-4 space-y-4">
            {items.length === 0 ? (
              <div className="rounded-2xl bg-slate-50 p-4 text-center text-sm text-slate-500">
                {t("emptyCart")}
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-4 border-b border-slate-100 pb-4 last:border-b-0 last:pb-0"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={item.image}
                      alt={resolveItemName(item)}
                      className="h-12 w-12 rounded-xl object-cover"
                    />
                    <div className={textAlign}>
                      <p className="text-sm font-semibold text-slate-900">
                        {resolveItemName(item)}
                      </p>
                      <p className="text-xs text-slate-400">
                        {t("quantity")}: {item.qty}
                      </p>
                    </div>
                  </div>
                  <span className="text-sm font-semibold text-orange-500">
                    {formatCurrency(item.price * item.qty, lang, 2)}
                  </span>
                </div>
              ))
            )}
          </div>

          <div className="mt-5 space-y-2 text-sm text-slate-500">
            <div className="flex items-center justify-between">
              <span>{t("subtotal")}</span>
              <span className="text-slate-700">
                {formatCurrency(subtotal, lang, 2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("tax")} ({Math.round(TAX_RATE * 100)}%)</span>
              <span className="text-slate-700">
                {formatCurrency(tax, lang, 2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>{t("service")} ({Math.round(SERVICE_RATE * 100)}%)</span>
              <span className="text-slate-700">
                {formatCurrency(service, lang, 2)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-slate-100 pt-3 text-base font-semibold text-slate-900">
              <span>{t("total")}</span>
              <span className="text-orange-600">
                {formatCurrency(total, lang, 2)}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-6">
          <h2 className="text-sm font-semibold text-slate-700">
            {t("orderNotes")}
          </h2>
          <textarea
            value={notes}
            onChange={(event) => setNotes(event.target.value)}
            placeholder={t("addNotesPlaceholder")}
            className="mt-4 h-24 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
          />
        </section>

        <section className="mt-6 rounded-3xl bg-white p-5 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-6">
          <h2 className="text-sm font-semibold text-slate-700">
            {t("paymentMethod")}
          </h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-3">
            {[
              { id: "balance", label: t("balance"), icon: "◎" },
              { id: "wallet", label: t("wallet"), icon: "👛" },
              { id: "card", label: t("card"), icon: "💳" },
            ].map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setPaymentMethod(option.id as PaymentMethod)}
                className={`flex items-center justify-center gap-2 rounded-2xl px-4 py-2.5 text-xs font-semibold ${
                  paymentMethod === option.id
                    ? "bg-orange-500 text-white"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <span>{option.icon}</span>
                {option.label}
              </button>
            ))}
          </div>

          {paymentMethod === "wallet" && (
            <div className="mt-5 space-y-4 text-sm">
              <div className={dir === "rtl" ? "text-end" : "text-start"}>
                <span className="text-xs font-semibold text-slate-500">
                  {t("selectWallet")}
                </span>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { id: "orange", label: t("walletOrange") },
                  { id: "vodafone", label: t("walletVodafone") },
                  { id: "instapay", label: t("walletInstapay") },
                  { id: "etisalat", label: t("walletEtisalat") },
                ].map((option) => (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setWalletProvider(option.id as WalletProvider)
                    }
                    className={`rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      walletProvider === option.id
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">
                  {t("phoneNumber")}
                </span>
                <input
                  type="tel"
                  value={walletPhone}
                  onChange={(event) => setWalletPhone(event.target.value)}
                  placeholder={t("walletPhonePlaceholder")}
                  dir="ltr"
                  className="mt-2 w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm outline-none focus:border-orange-300"
                />
              </label>
            </div>
          )}

          {paymentMethod === "card" && (
            <div className="mt-5 space-y-4 text-sm">
              <label className="block">
                <span className="text-xs font-semibold text-slate-500">
                  {t("cardNumber")}
                </span>
                <input
                  type="text"
                  value={cardNumber}
                  onChange={(event) => {
                    setCardNumber(event.target.value);
                    setCardErrors((prev) => ({ ...prev, cardNumber: undefined }));
                  }}
                  placeholder="1234 5678 9012 3456"
                  dir="ltr"
                  className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-orange-300 ${
                    cardErrors.cardNumber ? "border-rose-400" : "border-slate-200"
                  }`}
                />
                {cardErrors.cardNumber && (
                  <span
                    className={`mt-2 block text-xs text-rose-500 ${
                      dir === "rtl" ? "text-end" : "text-start"
                    }`}
                  >
                    {cardErrors.cardNumber}
                  </span>
                )}
              </label>
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="text-xs font-semibold text-slate-500">
                    {t("expiry")}
                  </span>
                  <input
                    type="text"
                    value={expiry}
                    onChange={(event) => {
                      setExpiry(event.target.value);
                      setCardErrors((prev) => ({ ...prev, expiry: undefined }));
                    }}
                    placeholder="MM/YY"
                    dir="ltr"
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-orange-300 ${
                      cardErrors.expiry ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {cardErrors.expiry && (
                    <span
                      className={`mt-2 block text-xs text-rose-500 ${
                        dir === "rtl" ? "text-end" : "text-start"
                      }`}
                    >
                      {cardErrors.expiry}
                    </span>
                  )}
                </label>
                <label className="block">
                  <span className="text-xs font-semibold text-slate-500">
                    {t("cvv")}
                  </span>
                  <input
                    type="text"
                    value={cvv}
                    onChange={(event) => {
                      setCvv(event.target.value);
                      setCardErrors((prev) => ({ ...prev, cvv: undefined }));
                    }}
                    placeholder="123"
                    dir="ltr"
                    className={`mt-2 w-full rounded-2xl border px-4 py-3 text-sm outline-none focus:border-orange-300 ${
                      cardErrors.cvv ? "border-rose-400" : "border-slate-200"
                    }`}
                  />
                  {cardErrors.cvv && (
                    <span
                      className={`mt-2 block text-xs text-rose-500 ${
                        dir === "rtl" ? "text-end" : "text-start"
                      }`}
                    >
                      {cardErrors.cvv}
                    </span>
                  )}
                </label>
              </div>
            </div>
          )}
        </section>

        <button
          type="button"
          onClick={handlePayNow}
          disabled={items.length === 0}
          className={`mt-6 w-full rounded-2xl py-4 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(234,106,54,0.35)] ${
            items.length === 0
              ? "cursor-not-allowed bg-orange-200"
              : "bg-gradient-to-r from-orange-500 to-orange-600"
          }`}
        >
          {t("payNow")} {formatCurrency(total, lang, 2)}
        </button>
      </div>

      {successInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[36px] bg-white px-6 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </div>
            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              {t("orderSuccess")}
            </h3>
            <p className="mt-2 text-sm text-slate-500">
              {t("orderSuccessMessage")}
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t("orderNumber")}</span>
                <span className="font-semibold text-slate-900">
                  {successInfo.orderNumber}
                </span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-400">{t("orderTime")}</span>
                <span>{successInfo.orderTime}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-400">{t("total")}</span>
                <span className="font-semibold text-orange-500">
                  {formatCurrency(total, lang, 2)}
                </span>
              </div>
              <div className="mt-3 border-t border-slate-200 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-400">{t("estimatedTime")}</span>
                  <span className="font-semibold text-emerald-600">
                    {t("estimatedTimeValue")}
                  </span>
                </div>
              </div>
            </div>

            <button className="mt-6 w-full rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-5 py-4 text-sm font-semibold text-white shadow-[0_14px_24px_rgba(234,106,54,0.3)]">
              {t("trackOrder")}
            </button>
            <Link
              href="/menu"
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-200 px-5 py-4 text-sm font-semibold text-slate-700"
            >
              <span>⌂</span>
              {t("backToMenu")}
            </Link>

            <div className="mt-5 text-xs font-semibold text-slate-400">
              {t("needHelp")}
            </div>
            <div className="mt-2 text-sm font-semibold text-orange-600">
              {t("contactSupport")}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
