"use client";

import { Suspense, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Cairo } from "next/font/google";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { getStoredTable, parseTableParam, setStoredTable } from "../../lib/table";
import { useLanguage } from "../../components/language-provider";
import { useSearchParams } from "next/navigation";
import ChatbotSection from "../../components/chatbot-section";
import {
  createCallRequest,
  fetchMenuCatalog,
  type MenuCatalog,
} from "../../services/menu-api";
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

function MenuPageContent() {
  const [activeId, setActiveId] = useState("all");
  const [catalog, setCatalog] = useState<MenuCatalog>(() => ({
    categories: [{ id: "all", label: { ar: "الكل", en: "All" }, icon: "✦" }],
    items: [],
    offers: [],
  }));
  const { dir, lang, t, toggleLang } = useLanguage();
  const searchParams = useSearchParams();
  const [tableNumber, setTableNumber] = useState<number | null>(null);
  const showCallWaiter = Boolean(tableNumber);
  const [showCallWaiterModal, setShowCallWaiterModal] = useState(false);
  const [showChatbot, setShowChatbot] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);
  const [callError, setCallError] = useState<string | null>(null);
  const [callNotice, setCallNotice] = useState<string | null>(null);
  const [isSendingCall, setIsSendingCall] = useState(false);
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
    const tableParam =
      searchParams.get("table") ||
      searchParams.get("table_id") ||
      searchParams.get("t");
    const parsed = parseTableParam(tableParam);
    if (parsed) {
      setStoredTable(parsed);
      setTableNumber(parsed);
      return;
    }

    const fromTable = searchParams.get("from") === "table";
    if (fromTable) {
      setTableNumber(getStoredTable());
      return;
    }

    setStoredTable(null);
    setTableNumber(null);
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

  const callReasons = [
    { id: "needBill", icon: "🧾" },
    { id: "needHelp", icon: "🆘" },
    { id: "additionalOrder", icon: "➕" },
    { id: "orderIssue", icon: "⚠️" },
  ] as const;

  const callReasonMap: Record<
    (typeof callReasons)[number]["id"],
    "BILL_REQUEST" | "HELP" | "EXTRA_ORDER" | "PROBLEM"
  > = {
    needBill: "BILL_REQUEST",
    needHelp: "HELP",
    additionalOrder: "EXTRA_ORDER",
    orderIssue: "PROBLEM",
  };

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
    try {
      await createCallRequest({
        table: tableNumber,
        type: callReasonMap[selectedReason as keyof typeof callReasonMap],
      });
      setShowCallWaiterModal(false);
      setSelectedReason(null);
      setCallNotice(t("callWaiterSuccess"));
    } catch (error) {
      const message =
        (error as { message?: string })?.message ?? t("callWaiterError");
      setCallError(message);
    } finally {
      setIsSendingCall(false);
    }
  };

  const resolvedActiveId = useMemo(() => {
    if (activeId === "all") {
      return "all";
    }
    return catalog.categories.some((category) => category.id === activeId)
      ? activeId
      : "all";
  }, [activeId, catalog.categories]);

  const filteredItems = useMemo(() => {
    if (resolvedActiveId === "all") {
      return catalog.items;
    }
    return catalog.items.filter((item) => item.category === resolvedActiveId);
  }, [resolvedActiveId, catalog.items]);

  useEffect(() => {
    let mounted = true;

    const loadCatalog = async () => {
      const data = await fetchMenuCatalog();
      if (!mounted || !data) {
        return;
      }

      setCatalog(data);
    };

    loadCatalog();
    return () => {
      mounted = false;
    };
  }, []);

  if (!isRestaurantOpen) {
    return (
      <div
        className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
        dir={dir}
      >
        <div className="flex min-h-screen items-center justify-center px-4">
          <div className="w-full max-w-md rounded-3xl bg-white px-6 py-10 text-center shadow-[0_16px_30px_rgba(15,23,42,0.12)] sm:px-10">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-rose-50 text-rose-600 text-2xl">
              !
            </div>
            <h2 className="mt-4 text-xl font-semibold text-slate-900">
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
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-6xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="grid grid-cols-3 items-center gap-3">
          <button
            type="button"
            onClick={toggleLang}
            className="h-11 w-11 rounded-full bg-white text-sm font-semibold text-orange-600 shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
            aria-label={t("language")}
            title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>
          <div className="text-center">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {t("restaurantName")}
            </h1>
          </div>
          <div className="h-11 w-11" aria-hidden="true" />
        </header>

        <div className="mt-5">
          <label className="relative block">
            <span className="sr-only">{t("search")}</span>
            <input
              type="text"
              placeholder={t("search")}
              className="w-full rounded-2xl border border-transparent bg-white px-5 py-4 text-sm text-slate-500 shadow-[0_10px_24px_rgba(15,23,42,0.06)] outline-none transition focus:border-orange-200"
            />
          </label>
        </div>

        <section className="mt-8 rounded-3xl bg-white px-5 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:px-6">
          <div className="flex items-center justify-between">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 text-white">
              %
            </div>
            <h2 className="text-base font-semibold text-slate-900 sm:text-lg">
              {t("todaysOffers")}
            </h2>
          </div>
        </section>

        <section className="mt-6 rounded-3xl bg-white p-4 shadow-[0_14px_30px_rgba(15,23,42,0.08)] sm:p-6">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {catalog.offers.map((offer) => (
              <article
                key={offer.id}
                className="relative overflow-hidden rounded-3xl bg-[#f8fafc] shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
              >
                {offer.badge && (
                  <span className="absolute right-4 top-4 rounded-full bg-orange-500/90 px-3 py-1 text-xs font-semibold text-white">
                    {offer.badge}
                  </span>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={offer.image}
                  alt={getLocalizedText(offer.title, lang)}
                  className="h-40 w-full object-cover"
                  loading="lazy"
                />
                <div className="space-y-2 px-5 pb-5 pt-4 text-sm">
                  <h3 className="text-base font-semibold">
                    {getLocalizedText(offer.title, lang)}
                  </h3>
                  <p className="text-slate-500">
                    {getLocalizedText(offer.desc, lang)}
                  </p>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-orange-500">
                      {formatCurrency(offer.price, lang)}
                    </span>
                    {offer.oldPrice ? (
                      <span className="text-xs text-slate-400 line-through">
                        {formatCurrency(offer.oldPrice, lang)}
                      </span>
                    ) : null}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-10">
          <div className="flex flex-wrap items-center gap-3">
            {catalog.categories.map((category) => (
              <button
                key={category.id}
                type="button"
                onClick={() => setActiveId(category.id)}
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-[0_10px_18px_rgba(15,23,42,0.08)] transition ${
                  resolvedActiveId === category.id
                    ? "bg-orange-500 text-white"
                    : "bg-white text-slate-700 hover:text-orange-500"
                }`}
              >
                <span>{category.icon}</span>
                {getLocalizedText(category.label, lang)}
              </button>
            ))}
          </div>
        </section>

        <section className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {filteredItems.length === 0 ? (
            <div className="col-span-full rounded-3xl bg-white px-6 py-10 text-center text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              <h3 className="text-base font-semibold text-slate-800">
                {t("emptyMenuTitle")}
              </h3>
              <p className="mt-2">{t("emptyMenuMessage")}</p>
            </div>
          ) : (
            filteredItems.map((item) => (
              <article
                key={item.id}
                className="overflow-hidden rounded-3xl bg-white shadow-[0_14px_30px_rgba(15,23,42,0.08)]"
              >
                <Link href={`/menu/${item.id}`} className="block">
                  <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image}
                    alt={getLocalizedText(item.name, lang)}
                    className="h-44 w-full object-cover"
                    loading="lazy"
                  />
                    {item.tag && (
                      <span
                        className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold text-white ${
                          item.tag === "new" ? "bg-emerald-500" : "bg-rose-500"
                        }`}
                      >
                        {item.tag === "new" ? t("tagNew") : t("tagHot")}
                      </span>
                    )}
                  </div>
                </Link>
                <div className="relative space-y-2 px-5 pb-10 pt-4 text-sm">
                  <Link href={`/menu/${item.id}`}>
                    <h3 className="text-base font-semibold">
                      {getLocalizedText(item.name, lang)}
                    </h3>
                  </Link>
                  <p className="text-slate-500">
                    {getLocalizedText(item.desc, lang)}
                  </p>
                  <p className="text-orange-500">
                    {formatCurrency(item.price, lang)}
                  </p>
                  <Link
                    href={`/menu/${item.id}`}
                    className={`absolute bottom-4 flex h-11 w-11 items-center justify-center rounded-full bg-orange-500 text-xl text-white shadow-[0_10px_18px_rgba(234,106,54,0.35)] ${
                      dir === "rtl" ? "left-4" : "right-4"
                    }`}
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

      {callNotice ? (
        <div className="fixed bottom-36 left-1/2 z-40 -translate-x-1/2 rounded-full bg-emerald-600 px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.35)]">
          {callNotice}
        </div>
      ) : null}

      <button
        type="button"
        onClick={() => setShowChatbot(true)}
        className="fixed bottom-20 right-6 flex items-center gap-2 rounded-full bg-black px-4 py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(0,0,0,0.2)]"
      >
        {t("talkWithUs")}
        <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-orange-500 text-white">
          💬
        </span>
      </button>

      {showChatbot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
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
      )}

      {showCallWaiter && (
        <div className="fixed bottom-20 left-6 z-40">
          <div className="absolute -bottom-3 left-1/2 h-7 w-7 -translate-x-1/2 rounded-full bg-orange-500" />
          <button
            type="button"
            onClick={() => {
              setCallError(null);
              setSelectedReason(null);
              setShowCallWaiterModal(true);
            }}
            className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white text-orange-500 shadow-[0_12px_24px_rgba(15,23,42,0.18)]"
            aria-label={t("callWaiterTitle")}
          >
            🛎️
          </button>
        </div>
      )}

      {showCallWaiterModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
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
              <h3 className="text-lg font-semibold text-slate-900">
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
                        ? "border-orange-400 bg-orange-50 text-orange-600"
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
              className={`mt-6 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(234,106,54,0.25)] ${
                selectedReason && !isSendingCall
                  ? "bg-orange-400"
                  : "cursor-not-allowed bg-orange-200"
              }`}
            >
              {isSendingCall ? t("sending") : t("send")}
            </button>
          </div>
        </div>
      )}

    </div>
  );
}

export default function MenuPage() {
  return (
    <Suspense fallback={null}>
      <MenuPageContent />
    </Suspense>
  );
}





