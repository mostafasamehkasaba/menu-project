"use client";

import { useEffect, useMemo, useState, type CSSProperties, type FormEvent } from "react";
import Link from "next/link";
import { Tajawal, Playfair_Display } from "next/font/google";
import { useLanguage } from "../../../components/language-provider";
import {
  applyMenuTheme,
  getMenuTheme,
  setMenuTheme,
  type MenuTheme,
} from "../../../lib/menu-theme";
import { menuV3Catalog, type MenuCatalog } from "../data";

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
  { id: "contact", labelAr: "تواصل", labelEn: "Contact", href: "/menu-v3/reservations#contact" },
];

const bookingTimeSlots = [
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

export default function MenuV3ReservationsPage() {
  const { dir, lang, t, toggleLang } = useLanguage();
  const [catalog] = useState<MenuCatalog>(menuV3Catalog);
  const headingFont = lang === "ar" ? tajawal.className : playfair.className;
  const [theme, setTheme] = useState<MenuTheme>("light");
  const [activeView, setActiveView] = useState<"booking" | "availability">("booking");
  const [bookingGuests, setBookingGuests] = useState(2);
  const [bookingDate, setBookingDate] = useState("");
  const [bookingTime, setBookingTime] = useState("");
  const [bookingName, setBookingName] = useState("");
  const [bookingPhone, setBookingPhone] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [bookingToast, setBookingToast] = useState<string | null>(null);
  const [selectedTableId, setSelectedTableId] = useState<number | null>(null);

  const tableData = useMemo(
    () => [
      { id: 1, number: 1, seats: 2, status: "available" },
      { id: 2, number: 2, seats: 4, status: "reserved" },
      { id: 3, number: 3, seats: 2, status: "available" },
      { id: 4, number: 4, seats: 6, status: "occupied" },
      { id: 5, number: 5, seats: 4, status: "available" },
      { id: 6, number: 6, seats: 2, status: "reserved" },
      { id: 7, number: 7, seats: 8, status: "available" },
      { id: 8, number: 8, seats: 4, status: "occupied" },
    ],
    [],
  );

  const availabilityStats = useMemo(() => {
    const available = tableData.filter((table) => table.status === "available").length;
    const reserved = tableData.filter((table) => table.status === "reserved").length;
    const occupied = tableData.filter((table) => table.status === "occupied").length;
    return { available, reserved, occupied };
  }, [tableData]);

  const availableTables = useMemo(
    () => tableData.filter((table) => table.status === "available"),
    [tableData],
  );

  const featured = useMemo(() => catalog.items.slice(0, 3), [catalog.items]);

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

  const isBookingComplete =
    bookingDate.trim().length > 0 &&
    bookingTime.trim().length > 0 &&
    bookingName.trim().length > 0 &&
    bookingPhone.trim().length > 0 &&
    selectedTableId !== null;

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

  useEffect(() => {
    if (!bookingToast) return;
    const timer = window.setTimeout(() => setBookingToast(null), 2600);
    return () => window.clearTimeout(timer);
  }, [bookingToast]);

  const handleBookingSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!isBookingComplete) {
      setBookingToast(
        lang === "ar"
          ? "من فضلك أكمل بيانات الحجز"
          : "Please complete the booking details",
      );
      return;
    }
    setBookingToast(
      lang === "ar"
        ? "تم استلام طلب الحجز وسيتم تأكيده قريبًا"
        : "Booking received. We will confirm shortly.",
    );
    setBookingDate("");
    setBookingTime("");
    setBookingName("");
    setBookingPhone("");
    setBookingNotes("");
    setBookingGuests(2);
    setSelectedTableId(null);
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
          className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-4 border-b border-white/70 bg-[color:var(--v3-cream)]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8"
        >
          <div className="flex items-center gap-3">
            <div className="grid h-12 w-12 place-items-center rounded-full bg-[color:var(--v3-accent)] text-white shadow-[0_12px_20px_rgba(184,93,61,0.25)]">
              U
            </div>
            <div className="text-right">
              <p className={`text-base font-semibold ${headingFont}`}>{t("restaurantName")}</p>
              <p className="text-sm text-[color:var(--v3-muted)]">
                {lang === "ar" ? "حجوزات راقية" : "Elegant Reservations"}
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
            {lang === "ar" ? "تجربة الحجز" : "Reservation Experience"}
          </p>
          <h1 className={`mt-4 text-4xl font-semibold sm:text-5xl ${headingFont}`}>
            {lang === "ar" ? "احجز طاولتك بكل سهولة" : "Reserve Your Table with Ease"}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-sm text-[color:var(--v3-muted)]">
            {lang === "ar"
              ? "اختر الموعد المناسب وسيقوم فريقنا بتأكيد الحجز خلال دقائق."
              : "Pick the perfect time and our team will confirm in minutes."}
          </p>
        </section>

        <section className="mt-8">
          <div className="flex flex-wrap gap-4">
            <button
              type="button"
              onClick={() => setActiveView("booking")}
              className={`flex-1 rounded-2xl px-5 py-4 text-sm font-semibold shadow-[0_12px_24px_rgba(15,23,42,0.12)] ${
                activeView === "booking"
                  ? "bg-[color:var(--v3-accent)] text-white"
                  : "bg-white text-[color:var(--v3-muted)]"
              }`}
            >
              {lang === "ar" ? "نموذج الحجز" : "Booking Form"}
            </button>
            <button
              type="button"
              onClick={() => setActiveView("availability")}
              className={`flex-1 rounded-2xl px-5 py-4 text-sm font-semibold shadow-[0_12px_24px_rgba(15,23,42,0.12)] ${
                activeView === "availability"
                  ? "bg-[color:var(--v3-accent)] text-white"
                  : "bg-white text-[color:var(--v3-muted)]"
              }`}
            >
              {lang === "ar" ? "الطاولات المتاحة" : "Table Availability"}
            </button>
          </div>
        </section>

        {activeView === "booking" ? (
          <section className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
            <form
              onSubmit={handleBookingSubmit}
              className="rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_22px_40px_rgba(15,23,42,0.12)] sm:p-7"
            >
              <div className="flex items-center justify-between">
                <h2 className={`text-xl font-semibold ${headingFont}`}>
                  {lang === "ar" ? "تفاصيل الحجز" : "Reservation Details"}
                </h2>
                <span className="text-xs text-[color:var(--v3-muted)]">
                  {lang === "ar" ? "تأكيد سريع" : "Fast confirmation"}
                </span>
              </div>

              {bookingToast ? (
                <div className="mt-4 rounded-2xl border border-[color:var(--v3-cream)] bg-[color:var(--v3-cream)]/70 px-4 py-3 text-sm text-[color:var(--v3-olive)]">
                  {bookingToast}
                </div>
              ) : null}

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              <div className="sm:col-span-2">
                <span className="mb-2 block text-sm font-semibold text-[color:var(--v3-ink)]">
                  {lang === "ar" ? "اختر الطاولة المتاحة" : "Select an available table"}
                </span>
                {availableTables.length ? (
                  <div className="grid gap-2 sm:grid-cols-3">
                    {availableTables.map((table) => (
                      <label
                        key={table.id}
                        className={`flex items-center justify-between rounded-2xl border px-3 py-2 text-xs font-semibold transition ${
                          selectedTableId === table.id
                            ? "border-[color:var(--v3-accent)] bg-[color:var(--v3-cream)] text-[color:var(--v3-accent)]"
                            : "border-slate-200 bg-white text-[color:var(--v3-muted)]"
                        }`}
                      >
                        <span>
                          {lang === "ar" ? "طاولة" : "Table"} {table.number}
                        </span>
                        <span className="text-[11px] text-[color:var(--v3-muted)]">
                          {lang === "ar" ? "عدد" : "Seats"} {table.seats}
                        </span>
                        <input
                          type="radio"
                          name="table"
                          checked={selectedTableId === table.id}
                          onChange={() => setSelectedTableId(table.id)}
                          className="h-4 w-4 accent-[color:var(--v3-accent)]"
                        />
                      </label>
                    ))}
                  </div>
                ) : (
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 text-xs text-[color:var(--v3-muted)]">
                    {lang === "ar"
                      ? "لا توجد طاولات متاحة حالياً."
                      : "No available tables at the moment."}
                  </div>
                )}
              </div>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[color:var(--v3-ink)]">
                  {lang === "ar" ? "التاريخ" : "Date"}
                </span>
                  <input
                    type="date"
                    value={bookingDate}
                    onChange={(event) => setBookingDate(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                  />
                </label>
                <div>
                  <span className="mb-2 block text-sm font-semibold text-[color:var(--v3-ink)]">
                    {lang === "ar" ? "الوقت" : "Time"}
                  </span>
                  <div className="grid grid-cols-3 gap-2">
                    {bookingTimeSlots.slice(0, 6).map((slot) => (
                      <button
                        key={slot}
                        type="button"
                        onClick={() => setBookingTime(slot)}
                        className={`rounded-xl border px-2 py-2 text-xs font-semibold transition ${
                          bookingTime === slot
                            ? "border-[color:var(--v3-accent)] bg-[color:var(--v3-cream)] text-[color:var(--v3-accent)]"
                            : "border-slate-200 bg-white text-[color:var(--v3-muted)] hover:border-[color:var(--v3-accent)]/40"
                        }`}
                      >
                        {slot}
                      </button>
                    ))}
                  </div>
                  <div className="mt-2 text-xs text-[color:var(--v3-muted)]">
                    {lang === "ar" ? "المواعيد المتاحة لليوم" : "Available times for today"}
                  </div>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <span className="text-sm font-semibold text-[color:var(--v3-ink)]">
                  {lang === "ar" ? "عدد الضيوف" : "Guests"}
                </span>
                <div className="flex items-center gap-3">
                  <button
                    type="button"
                    onClick={() => setBookingGuests((prev) => Math.max(1, prev - 1))}
                    className="h-9 w-9 rounded-full bg-[color:var(--v3-cream)] text-base font-semibold text-[color:var(--v3-olive)]"
                  >
                    -
                  </button>
                  <span className="text-base font-semibold">{bookingGuests}</span>
                  <button
                    type="button"
                    onClick={() => setBookingGuests((prev) => prev + 1)}
                    className="h-9 w-9 rounded-full bg-[color:var(--v3-accent)] text-base font-semibold text-white shadow-[0_12px_20px_rgba(184,93,61,0.28)]"
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[color:var(--v3-ink)]">
                    {lang === "ar" ? "الاسم" : "Name"}
                  </span>
                  <input
                    type="text"
                    placeholder={lang === "ar" ? "اكتب الاسم الكامل" : "Full name"}
                    value={bookingName}
                    onChange={(event) => setBookingName(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                  />
                </label>
                <label className="block">
                  <span className="mb-2 block text-sm font-semibold text-[color:var(--v3-ink)]">
                    {lang === "ar" ? "رقم الهاتف" : "Phone"}
                  </span>
                  <input
                    type="tel"
                    placeholder="0555-000-111"
                    value={bookingPhone}
                    onChange={(event) => setBookingPhone(event.target.value)}
                    className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                  />
                </label>
              </div>

              <label className="mt-4 block">
                <span className="mb-2 block text-sm font-semibold text-[color:var(--v3-ink)]">
                  {lang === "ar" ? "ملاحظات إضافية" : "Notes"}
                </span>
                <textarea
                  placeholder={lang === "ar" ? "أي طلبات خاصة؟" : "Any special requests?"}
                  value={bookingNotes}
                  onChange={(event) => setBookingNotes(event.target.value)}
                  className="h-28 w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[color:var(--v3-accent)]"
                />
              </label>

              <button
                type="submit"
                className={`mt-6 w-full rounded-2xl py-3 text-sm font-semibold text-white shadow-[0_16px_30px_rgba(184,93,61,0.3)] ${
                  isBookingComplete
                    ? "bg-[color:var(--v3-accent)]"
                    : "cursor-not-allowed bg-[color:var(--v3-accent)]/50"
                }`}
              >
                {lang === "ar" ? "تأكيد الحجز" : "Confirm Reservation"}
              </button>
            </form>

            <div className="space-y-5">
              <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_30px_rgba(15,23,42,0.1)]">
                <h3 className={`text-lg font-semibold ${headingFont}`}>
                  {lang === "ar" ? "لماذا تحجز معنا؟" : "Why book with us?"}
                </h3>
                <p className="mt-3 text-sm text-[color:var(--v3-muted)]">
                  {lang === "ar"
                    ? "قاعة أنيقة، خدمة راقية، وتجربة طعام مصممة خصيصًا لك."
                    : "Elegant ambiance, premium service, and a tailored dining experience."}
                </p>
                <div className="mt-4 rounded-2xl bg-[color:var(--v3-cream)]/70 px-4 py-3 text-sm text-[color:var(--v3-olive)]">
                  {lang === "ar"
                    ? "الحجز متاح يوميًا من 12 ظهرًا حتى 11 مساءً."
                    : "Reservations available daily from 12 PM to 11 PM."}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_30px_rgba(15,23,42,0.1)]">
                <h3 className={`text-lg font-semibold ${headingFont}`}>
                  {lang === "ar" ? "أطباق مقترحة" : "Chef’s Picks"}
                </h3>
                <div className="mt-4 space-y-3">
                  {featured.map((item) => (
                    <div key={item.id} className="flex items-center gap-3 rounded-2xl bg-white px-3 py-2 shadow-[0_12px_20px_rgba(15,23,42,0.08)]">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-[color:var(--v3-ink)]">
                          {lang === "ar" ? item.name.ar : item.name.en}
                        </p>
                        <p className="text-xs text-[color:var(--v3-muted)]">
                          {lang === "ar" ? item.desc.ar : item.desc.en}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/70 bg-white/80 p-6 shadow-[0_18px_30px_rgba(15,23,42,0.1)]">
                <h3 className={`text-lg font-semibold ${headingFont}`}>
                  {lang === "ar" ? "تأكيد سريع" : "Fast Confirmation"}
                </h3>
                <p className="mt-3 text-sm text-[color:var(--v3-muted)]">
                  {lang === "ar"
                    ? "فريقنا يتواصل معك خلال دقائق لتأكيد الحجز وإتمام التفاصيل."
                    : "Our team contacts you in minutes to confirm all details."}
                </p>
                <div className="mt-4 flex items-center justify-between rounded-2xl border border-dashed border-[color:var(--v3-olive)]/40 px-4 py-3 text-sm text-[color:var(--v3-muted)]">
                  <span>{lang === "ar" ? "خدمة العملاء" : "Support"}</span>
                  <span className="font-semibold text-[color:var(--v3-accent)]">0555-000-111</span>
                </div>
              </div>
            </div>
          </section>
        ) : (
          <section className="mt-8">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="rounded-[24px] bg-white/90 px-5 py-4 shadow-[0_14px_26px_rgba(15,23,42,0.12)]">
                <p className="text-xs font-semibold uppercase text-[color:var(--v3-muted)]">
                  {lang === "ar" ? "متاحة" : "Available"}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${headingFont}`}>
                  {availabilityStats.available}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/90 px-5 py-4 shadow-[0_14px_26px_rgba(15,23,42,0.12)]">
                <p className="text-xs font-semibold uppercase text-[color:var(--v3-muted)]">
                  {lang === "ar" ? "محجوزة" : "Reserved"}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${headingFont}`}>
                  {availabilityStats.reserved}
                </p>
              </div>
              <div className="rounded-[24px] bg-white/90 px-5 py-4 shadow-[0_14px_26px_rgba(15,23,42,0.12)]">
                <p className="text-xs font-semibold uppercase text-[color:var(--v3-muted)]">
                  {lang === "ar" ? "مشغولة" : "Occupied"}
                </p>
                <p className={`mt-2 text-2xl font-semibold ${headingFont}`}>
                  {availabilityStats.occupied}
                </p>
              </div>
            </div>

            <div className="mt-6 rounded-[32px] border border-white/70 bg-white/90 p-6 shadow-[0_18px_34px_rgba(15,23,42,0.12)]">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <h2 className={`text-xl font-semibold ${headingFont}`}>
                  {lang === "ar" ? "حالة الطاولات" : "Table Status"}
                </h2>
                <div className="flex items-center gap-3 text-xs font-semibold text-[color:var(--v3-muted)]">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500" />
                    {lang === "ar" ? "متاحة" : "Available"}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-500" />
                    {lang === "ar" ? "محجوزة" : "Reserved"}
                  </span>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-rose-500" />
                    {lang === "ar" ? "مشغولة" : "Occupied"}
                  </span>
                </div>
              </div>

              <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {tableData.map((table) => {
                  const statusClass =
                    table.status === "available"
                      ? "border-emerald-200 bg-emerald-50 text-emerald-600"
                      : table.status === "reserved"
                        ? "border-amber-200 bg-amber-50 text-amber-600"
                        : "border-rose-200 bg-rose-50 text-rose-600";
                  return (
                    <div
                      key={table.id}
                      className={`rounded-2xl border px-4 py-3 ${statusClass}`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="text-sm font-semibold">
                          {lang === "ar" ? "طاولة" : "Table"} {table.number}
                        </div>
                        <div className="text-xs font-semibold">
                          {lang === "ar" ? "عدد" : "Seats"} {table.seats}
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-[color:var(--v3-muted)]">
                        {lang === "ar"
                          ? table.status === "available"
                            ? "متاحة الآن"
                            : table.status === "reserved"
                              ? "محجوزة"
                              : "مشغولة"
                          : table.status === "available"
                            ? "Available now"
                            : table.status === "reserved"
                              ? "Reserved"
                              : "Occupied"}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}
      </div>

      <footer
        id="contact"
        className="mt-12 w-full border-y border-white/60 bg-white/85 shadow-[0_18px_32px_rgba(184,93,61,0.1)] backdrop-blur"
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
              {lang === "ar" ? "المواعيد" : "Hours"}
            </p>
            <span className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "يوميًا 12:00 - 23:00" : "Daily 12:00 - 23:00"}
            </span>
            <span className="block text-[color:var(--v3-muted)]">
              {lang === "ar" ? "متاح للحجوزات الخاصة" : "Private bookings available"}
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
        <div className="mx-auto max-w-6xl px-6 pb-10 text-center text-sm text-[color:var(--v3-muted)]">
          {lang === "ar" ? "© 2026 جميع الحقوق محفوظة" : "© 2026 All rights reserved"}
        </div>
      </footer>

      <style jsx global>{`
        .menu-v3-skin {
          background: var(--v3-cream) !important;
          color: var(--v3-ink);
          overflow-x: hidden;
          scroll-behavior: smooth;
          scroll-padding-top: 96px;
        }
      `}</style>
    </div>
  );
}
