"use client";

export const dynamic = "force-dynamic";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Cairo } from "next/font/google";
import type { TranslationKey } from "../lib/i18n";
import { useLanguage } from "../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

const stats: {
  label: TranslationKey;
  value: string;
  color: string;
  icon: string;
}[] = [
  { label: "avgWaitTime", value: "15m", color: "text-blue-600", icon: "🕑" },
  {
    label: "availableTables",
    value: "8",
    color: "text-emerald-600",
    icon: "🪑",
  },
  {
    label: "todaysBookings",
    value: "24",
    color: "text-orange-600",
    icon: "📅",
  },
];

const timeSlots = [
  "12:00",
  "12:30",
  "13:00",
  "14:00",
  "15:30",
  "17:00",
  "18:30",
  "19:30",
  "20:00",
  "21:00",
  "22:00",
  "22:30",
];

type TableStatus = "available" | "reserved" | "occupied";

type TableFloor = {
  id: string;
  label: TranslationKey;
  icon: string;
  tables: { id: number; seats: number; status: TableStatus }[];
};

const tableFloors: TableFloor[] = [
  {
    id: "ground",
    label: "groundFloor",
    icon: "⌂",
    tables: [
      { id: 1, seats: 2, status: "available" },
      { id: 2, seats: 2, status: "occupied" },
      { id: 3, seats: 4, status: "available" },
      { id: 4, seats: 4, status: "reserved" },
      { id: 5, seats: 6, status: "available" },
      { id: 6, seats: 6, status: "available" },
      { id: 7, seats: 8, status: "occupied" },
      { id: 8, seats: 4, status: "available" },
    ],
  },
  {
    id: "first",
    label: "firstFloor",
    icon: "⌂",
    tables: [
      { id: 9, seats: 2, status: "reserved" },
      { id: 10, seats: 4, status: "available" },
      { id: 11, seats: 6, status: "available" },
      { id: 12, seats: 8, status: "available" },
    ],
  },
];

function BookPageContent() {
  const { dir, lang, t, toggleLang } = useLanguage();
  const searchParams = useSearchParams();
  const view = searchParams.get("view");
  const from = searchParams.get("from");

  const [activeView, setActiveView] = useState<"availability" | "booking">(
    "availability",
  );

  const [tableFloorsState, setTableFloorsState] =
    useState<TableFloor[]>(tableFloors);

  const [selectedTable, setSelectedTable] = useState<{
    floorId: string;
    tableId: number;
  } | null>(null);

  const [guestCount, setGuestCount] = useState(2);
  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");
  const [guestName, setGuestName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showConfirm, setShowConfirm] = useState(false);

  // ✅ NEW: snapshot confirmed booking before resetting fields
  const [confirmed, setConfirmed] = useState<{
    date: string;
    time: string;
    guests: number;
  } | null>(null);

  const router = useRouter();

  const isFormComplete =
    selectedDate.trim().length > 0 &&
    selectedTime.trim().length > 0 &&
    guestName.trim().length > 0 &&
    phoneNumber.trim().length > 0 &&
    !!selectedTable;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleHash = () => {
      const hash = window.location.hash.replace("#", "");

      if (hash === "availability" || hash === "tables") {
        setActiveView("availability");
        window.setTimeout(() => {
          document
            .getElementById("availability")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
        return;
      }

      if (hash === "booking" || hash === "booking-form") {
        setActiveView("booking");
        window.setTimeout(() => {
          document
            .getElementById("booking-form")
            ?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 0);
        return;
      }

      if (view === "availability" || from === "table") {
        setActiveView("availability");
        return;
      }

      if (view === "booking") {
        setActiveView("booking");
      }
    };

    handleHash();
    window.addEventListener("hashchange", handleHash);
    return () => window.removeEventListener("hashchange", handleHash);
  }, [from, view]);

  useEffect(() => {
    if (!toast) return;
    const timer = window.setTimeout(() => setToast(null), 2500);
    return () => window.clearTimeout(timer);
  }, [toast]);

  useEffect(() => {
    if (!showConfirm) return;

    const timer = window.setTimeout(() => {
      router.push("/menu?from=table");
    }, 1800);

    return () => window.clearTimeout(timer);
  }, [showConfirm, router]);

  const handleConfirm = () => {
    if (!isFormComplete) return;

    // ✅ NEW: take snapshot BEFORE resetting
    setConfirmed({
      date: selectedDate,
      time: selectedTime,
      guests: guestCount,
    });

    if (selectedTable) {
      setTableFloorsState((prev) =>
        prev.map((floor) => {
          if (floor.id !== selectedTable.floorId) return floor;

          return {
            ...floor,
            tables: floor.tables.map((table) =>
              table.id === selectedTable.tableId
                ? { ...table, status: "reserved" }
                : table,
            ),
          };
        }),
      );
    }

    setShowConfirm(true);

    // reset form
    setSelectedDate("");
    setSelectedTime("");
    setGuestName("");
    setPhoneNumber("");
    setNotes("");
    setGuestCount(2);
    setSelectedTable(null);
  };

  const statusStyles: Record<
    TableStatus,
    { dot: string; border: string; bg: string; text: string }
  > = {
    available: {
      dot: "bg-emerald-500",
      border: "border-emerald-500",
      bg: "bg-emerald-50",
      text: "text-emerald-600",
    },
    reserved: {
      dot: "bg-orange-500",
      border: "border-orange-500",
      bg: "bg-orange-50",
      text: "text-orange-600",
    },
    occupied: {
      dot: "bg-rose-500",
      border: "border-rose-500",
      bg: "bg-rose-50",
      text: "text-rose-600",
    },
  };

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <section className="w-full bg-gradient-to-b from-orange-500 to-orange-600 text-white shadow-[0_18px_36px_rgba(234,106,54,0.28)]">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5 sm:px-10">
          <button
            type="button"
            onClick={toggleLang}
            className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-[11px] font-semibold"
            aria-label={t("language")}
            title={lang === "ar" ? t("languageEnglish") : t("languageArabic")}
          >
            {lang === "ar" ? "EN" : "AR"}
          </button>

          <div className="text-center">
            <h1 className="text-xl font-semibold sm:text-2xl">
              {t("bookTable")}
            </h1>
            <p className="text-sm text-orange-100 sm:text-base">
              {t("reserveYourTableNow")}
            </p>
          </div>

          <Link
            href="/menu"
            className="grid h-10 w-10 place-items-center rounded-full bg-white/20 text-lg"
          >
            →
          </Link>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-6 pb-28 pt-8 sm:px-10">
        <div className="flex flex-wrap gap-5">
          <button
            type="button"
            onClick={() => setActiveView("availability")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${
              activeView === "availability"
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            ▦ {t("tableAvailability")}
          </button>

          <button
            type="button"
            onClick={() => setActiveView("booking")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-2xl px-5 py-4 text-base font-semibold shadow-[0_12px_24px_rgba(234,106,54,0.3)] ${
              activeView === "booking"
                ? "bg-orange-500 text-white"
                : "bg-white text-slate-700"
            }`}
          >
            🗓 {t("bookingForm")}
          </button>
        </div>

        {activeView === "availability" ? (
          <section id="availability" className="mt-8 space-y-6">
            <div className="rounded-3xl bg-white px-6 py-4 shadow-[0_12px_24px_rgba(15,23,42,0.08)]">
              <div className="flex flex-wrap items-center justify-between gap-4 text-sm font-semibold text-slate-500">
                <span>{t("tableStatus")}</span>
                <div className="flex flex-wrap items-center gap-4">
                  {(["occupied", "reserved", "available"] as TableStatus[]).map(
                    (status) => (
                      <div key={status} className="flex items-center gap-2">
                        <span
                          className={`h-2 w-2 rounded-full ${statusStyles[status].dot}`}
                        />
                        <span>{t(status)}</span>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {tableFloorsState.map((floor) => (
              <section
                key={floor.id}
                className="rounded-3xl bg-white p-5 shadow-[0_12px_24px_rgba(15,23,42,0.08)] sm:p-6"
              >
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-semibold text-slate-700">
                    {t(floor.label)}
                  </h3>
                  <span className="text-sm text-orange-500">{floor.icon}</span>
                </div>

                <div className="mt-4 grid gap-4 md:grid-cols-2">
                  {floor.tables.map((table) => {
                    const style = statusStyles[table.status];
                    return (
                      <div
                        key={table.id}
                        className={`rounded-2xl border p-4 ${style.bg} ${style.border}`}
                      >
                        <div
                          className={`flex items-center justify-between gap-4 ${
                            dir === "rtl" ? "flex-row-reverse" : ""
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div
                              className={`grid h-8 w-8 place-items-center rounded-full bg-white text-xs ${style.text}`}
                            >
                              👤
                            </div>
                            <div
                              className={
                                dir === "rtl" ? "text-end" : "text-start"
                              }
                            >
                              <p
                                className={`text-xs font-semibold ${style.text}`}
                              >
                                {t(table.status)}
                              </p>
                            </div>
                          </div>

                          <div
                            className={
                              dir === "rtl" ? "text-end" : "text-start"
                            }
                          >
                            <p
                              className={`text-sm font-semibold ${style.text}`}
                            >
                              {t("table")} {table.id}
                            </p>
                            <p className="text-xs text-slate-500">
                              {t("seats")} {table.seats}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
            ))}
          </section>
        ) : (
          <>
            <section className="mt-8 grid gap-5 md:grid-cols-3">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-3xl bg-white px-6 py-6 text-center shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
                >
                  <div className="flex items-center justify-center gap-2 text-base font-semibold text-slate-600">
                    <span>{stat.icon}</span>
                    <span className={stat.color}>{t(stat.label)}</span>
                  </div>
                  <div className="mt-2 text-3xl font-semibold text-slate-900">
                    {stat.value}
                  </div>
                </div>
              ))}
            </section>

            <section
              id="booking-form"
              className="mt-10 rounded-3xl bg-white p-7 shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            >
              <div className="flex items-center justify-end">
                <h2 className="text-base font-semibold text-slate-800">
                  {t("reservationDetails")}
                </h2>
              </div>

              <div className="mt-6 space-y-5">
                <div>
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("selectTable")}
                  </span>

                  <div className="grid gap-3 sm:grid-cols-3">
                    {tableFloorsState
                      .flatMap((floor) =>
                        floor.tables
                          .filter((table) => table.status === "available")
                          .map((table) => ({
                            floorId: floor.id,
                            tableId: table.id,
                          })),
                      )
                      .map((table) => {
                        const isSelected =
                          selectedTable?.floorId === table.floorId &&
                          selectedTable?.tableId === table.tableId;

                        return (
                          <label
                            key={`${table.floorId}-${table.tableId}`}
                            className={`flex items-center justify-between gap-3 rounded-2xl border px-4 py-3 text-sm font-semibold ${
                              isSelected
                                ? "border-orange-400 bg-orange-50 text-orange-600"
                                : "border-slate-200 text-slate-600"
                            }`}
                          >
                            <span>
                              {t("table")} {table.tableId}
                            </span>
                            <input
                              type="radio"
                              name="table"
                              checked={isSelected}
                              onChange={() =>
                                setSelectedTable({
                                  floorId: table.floorId,
                                  tableId: table.tableId,
                                })
                              }
                              className="h-4 w-4 accent-orange-500"
                            />
                          </label>
                        );
                      })}
                  </div>

                  {tableFloorsState.every((floor) =>
                    floor.tables.every((table) => table.status !== "available"),
                  ) && (
                    <p className="mt-3 text-sm text-slate-500">
                      {t("noAvailableTables")}
                    </p>
                  )}
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("selectDate")}
                  </span>
                  <input
                    type="date"
                    value={selectedDate}
                    onChange={(event) => setSelectedDate(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-orange-300"
                  />
                </label>

                <div className="space-y-2">
                  <div className="flex items-center justify-end text-sm font-semibold text-slate-700">
                    {t("selectTime")}
                  </div>
                  <div className="grid gap-3 sm:grid-cols-4">
                    {timeSlots.map((time) => (
                      <button
                        key={time}
                        type="button"
                        onClick={() => setSelectedTime(time)}
                        className={`rounded-2xl border py-2.5 text-sm font-semibold ${
                          selectedTime === time
                            ? "border-orange-400 bg-orange-50 text-orange-600"
                            : "border-slate-200 bg-slate-50 text-slate-600 hover:border-orange-300 hover:text-orange-500"
                        }`}
                      >
                        {time}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex items-center justify-between rounded-2xl border border-slate-200 px-4 py-3">
                  <span className="text-sm font-semibold text-slate-700">
                    {t("numberOfGuests")}
                  </span>
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        setGuestCount((prev) => Math.max(1, prev - 1))
                      }
                      className="h-9 w-9 rounded-full bg-slate-100 text-base font-semibold text-slate-600"
                    >
                      -
                    </button>
                    <span className="text-base font-semibold">
                      {guestCount}
                    </span>
                    <button
                      type="button"
                      onClick={() => setGuestCount((prev) => prev + 1)}
                      className="h-9 w-9 rounded-full bg-orange-500 text-base font-semibold text-white"
                    >
                      +
                    </button>
                  </div>
                </div>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("yourName")}
                  </span>
                  <input
                    type="text"
                    placeholder={t("enterYourName")}
                    value={guestName}
                    onChange={(event) => setGuestName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-orange-300"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("phoneNumber")}
                  </span>
                  <input
                    type="tel"
                    placeholder={t("enterYourPhone")}
                    value={phoneNumber}
                    onChange={(event) => setPhoneNumber(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-orange-300"
                  />
                </label>

                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-slate-700">
                    {t("specialRequestsOptional")}
                  </span>
                  <textarea
                    placeholder={t("anySpecialRequests")}
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                    className="h-28 w-full rounded-2xl border border-slate-200 px-4 py-3 text-base outline-none focus:border-orange-300"
                  />
                </label>
              </div>

              <button
                type="button"
                disabled={!isFormComplete}
                onClick={handleConfirm}
                className={`mt-8 w-full rounded-2xl py-4 text-base font-semibold text-white shadow-[0_14px_24px_rgba(234,106,54,0.3)] ${
                  isFormComplete
                    ? "bg-orange-400"
                    : "cursor-not-allowed bg-orange-200"
                }`}
              >
                {t("confirmReservation")}
              </button>
            </section>

            <section className="mt-5 space-y-3">
              <div className="rounded-2xl bg-blue-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {t("reservationPolicy")}
              </div>
              <div className="rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-semibold text-slate-700">
                {t("needHelp")}
              </div>
            </section>
          </>
        )}
      </div>

      {toast && (
        <div className="fixed right-6 top-6 rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-slate-900 shadow-[0_18px_30px_rgba(15,23,42,0.18)]">
          {toast}
        </div>
      )}

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="w-full max-w-md rounded-[36px] bg-white px-6 py-8 text-center shadow-[0_24px_60px_rgba(15,23,42,0.3)]">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-100 text-3xl text-emerald-600">
              ✓
            </div>

            <h3 className="mt-5 text-xl font-semibold text-slate-900">
              {t("bookingConfirmed")}
            </h3>

            <p className="mt-2 text-sm text-slate-500">
              {t("reservationSuccessMessage")}
            </p>

            <div className="mt-6 rounded-2xl bg-slate-50 px-5 py-4 text-sm text-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">{t("dateLabel")}:</span>
                <span>{confirmed?.date ?? ""}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-400">{t("timeLabel")}:</span>
                <span>{confirmed?.time ?? ""}</span>
              </div>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-slate-400">{t("guestsLabel")}:</span>
                <span>{confirmed?.guests ?? guestCount}</span>
              </div>
            </div>

            <p className="mt-6 text-xs font-semibold text-slate-400">
              {t("redirectingToAccount")}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

export default function BookPage() {
  return (
    <Suspense fallback={null}>
      <BookPageContent />
    </Suspense>
  );
}
