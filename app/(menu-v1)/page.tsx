"use client";

import Link from "next/link";
import { Cairo } from "next/font/google";
import { useLanguage } from "../components/language-provider";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { fetchMenuTables } from "../services/menu-api";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function Home() {
  const { dir, lang, t } = useLanguage();
  const router = useRouter();
  const [showTablePicker, setShowTablePicker] = useState(false);
  const [selectedTable, setSelectedTable] = useState<number | null>(null);
  const [isRestaurantOpen, setIsRestaurantOpen] = useState(true);
  const [availableTables, setAvailableTables] = useState<number[]>([]);
  const [tablesLoading, setTablesLoading] = useState(true);

  const loadTables = async (signal?: { cancelled: boolean }) => {
    setTablesLoading(true);
    const data = await fetchMenuTables();
    if (signal?.cancelled) {
      return;
    }
    const normalized = data
      .map((table) => {
        const number =
          table.number ??
          table.table_number ??
          (Number.isFinite(Number(table.code)) ? Number(table.code) : null) ??
          table.id;
        return {
          number: Number.isFinite(number) ? Number(number) : null,
          status: table.status,
        };
      })
      .filter((table) => Number.isFinite(table.number)) as {
      number: number;
      status?: "AVAILABLE" | "OCCUPIED" | "RESERVED";
    }[];

    const withStatus = normalized.some((table) => table.status);
    const filtered = withStatus
      ? normalized.filter((table) => table.status === "AVAILABLE")
      : normalized;
    const numbers = (filtered.length ? filtered : normalized)
      .map((table) => table.number)
      .sort((a, b) => a - b);
    setAvailableTables(numbers);
    setTablesLoading(false);
  };

  useEffect(() => {
    const signal = { cancelled: false };
    loadTables(signal);
    return () => {
      signal.cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!showTablePicker) {
      return;
    }
    const signal = { cancelled: false };
    loadTables(signal);
    return () => {
      signal.cancelled = true;
    };
  }, [showTablePicker]);

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
              {lang === "ar" ? "ط§ظ„ظ…ط·ط¹ظ… ظ…ط؛ظ„ظ‚ ط§ظ„ط¢ظ†" : "Restaurant is closed now"}
            </h2>
            <p className="mt-2 text-sm text-slate-500">
              {lang === "ar"
                ? "ظٹط±ط¬ظ‰ ط§ظ„ظ…ط­ط§ظˆظ„ط© ظ„ط§ط­ظ‚ط§ظ‹."
                : "Please try again later."}
            </p>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div
      className={`${cairo.className} relative min-h-screen overflow-hidden bg-[radial-gradient(900px_circle_at_8%_-10%,#fff0e6,transparent_55%),radial-gradient(900px_circle_at_95%_25%,#ffe7d9,transparent_55%),linear-gradient(180deg,#fff7f0_0%,#fffaf6_45%,#ffffff_100%)] text-slate-900`}
      dir={dir}
    >
      <div className="pointer-events-none absolute -left-24 top-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffd7c2,transparent_60%)] opacity-70" />
      <div className="pointer-events-none absolute -right-24 top-36 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,#ffcaa9,transparent_60%)] opacity-60" />

      <main className="relative z-10 mx-auto flex min-h-[72vh] max-w-3xl flex-col items-center justify-center px-6 pb-16 pt-6 text-center sm:px-10">
        <div className="relative mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-white shadow-[0_18px_40px_rgba(232,110,62,0.2)]">
          <div className="absolute inset-0 rounded-full border-[5px] border-orange-200" />
          <div className="absolute inset-2 rounded-full border-[4px] border-orange-400" />
          <div className="grid h-12 w-12 place-items-center rounded-lg bg-orange-100 text-orange-600">
            <div className="grid h-8 w-8 grid-cols-3 gap-1">
              {Array.from({ length: 9 }).map((_, index) => (
                <span
                  key={index}
                  className="h-2 w-2 rounded-sm bg-orange-500"
                />
              ))}
            </div>
          </div>
        </div>

        <h1 className="text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
          {t("welcomeTitle")}
        </h1>
        <p className="mt-2 text-base text-slate-500 sm:text-lg">
          <span className="inline-flex items-center gap-2" dir="ltr">
            <span className="inline-flex h-6 w-8 items-center justify-center rounded-md bg-orange-100 text-orange-600">
              <svg
                viewBox="0 0 24 24"
                aria-hidden="true"
                className="h-4 w-6"
              >
                <path
                  d="M3 5h1v14H3V5zm3 0h2v14H6V5zm4 0h1v14h-1V5zm3 0h2v14h-2V5zm4 0h1v14h-1V5zm3 0h2v14h-2V5z"
                  fill="currentColor"
                />
              </svg>
            </span>
            <span dir={dir}>{t("restaurantName")}</span>
          </span>
        </p>

        <div className="mt-10 flex w-full max-w-md flex-col gap-4">
          <Link
            href="/menu"
            className="flex items-center justify-center gap-3 rounded-2xl border border-orange-300 bg-white px-6 py-4 text-base font-semibold text-orange-600 shadow-[0_10px_24px_rgba(234,130,70,0.12)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(234,130,70,0.18)]"
          >
            <span className="text-lg">ًںچ´</span>
            {t("viewMenuOnly")}
          </Link>
          <button
            type="button"
            onClick={() => setShowTablePicker(true)}
            className="flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-orange-500 to-orange-600 px-6 py-4 text-base font-semibold text-white shadow-[0_18px_35px_rgba(234,106,54,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_22px_40px_rgba(234,106,54,0.4)]"
          >
            <span className="text-lg">ًںچ½ï¸ڈ</span>
            {t("orderFromTable")}
          </button>
        </div>
      </main>
      {showTablePicker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-[36px] bg-white px-6 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <h3 className="text-xl font-semibold text-slate-900">
              {t("selectTable")}
            </h3>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {tablesLoading ? (
                <div className="col-span-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">
                  {t("tablesLoading")}
                </div>
              ) : availableTables.length === 0 ? (
                <div className="col-span-full rounded-2xl border border-slate-200 px-4 py-3 text-sm text-slate-500">
                  {t("noAvailableTables")}
                </div>
              ) : null}

              {!tablesLoading &&
                availableTables.map((table) => {
                const isSelected = selectedTable === table;
                return (
                  <label
                    key={table}
                    className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                      isSelected
                        ? "border-orange-400 bg-orange-50 text-orange-600"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    <span>
                      {t("table")} {table}
                    </span>
                    <input
                      type="radio"
                      name="table"
                      checked={isSelected}
                      onChange={() => setSelectedTable(table)}
                      className="h-4 w-4 accent-orange-500"
                      />
                    </label>
                );
              })}
            </div>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              <button
                type="button"
                disabled={!selectedTable}
                onClick={() => {
                  if (!selectedTable) {
                    return;
                  }
                  setShowTablePicker(false);
                  setSelectedTable(null);
                  router.push(`/menu?from=table&table=${selectedTable}`);
                }}
                className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(234,106,54,0.25)] ${
                  selectedTable
                    ? "bg-orange-500"
                    : "cursor-not-allowed bg-orange-200"
                }`}
              >
                {t("confirm")}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTablePicker(false);
                  setSelectedTable(null);
                }}
                className="rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-600"
              >
                {t("cancel")}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

