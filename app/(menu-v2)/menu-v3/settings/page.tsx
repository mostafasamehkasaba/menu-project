"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type CSSProperties, type ReactNode } from "react";
import { Tajawal, Playfair_Display } from "next/font/google";
import { useLanguage } from "../../../components/language-provider";
import {
  applyMenuTheme,
  getMenuTheme,
  setMenuTheme,
  type MenuTheme,
} from "../../../lib/menu-theme";

const tajawal = Tajawal({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "700"],
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

type SettingsState = {
  notifications: boolean;
  offers: boolean;
  reservations: boolean;
  showImages: boolean;
  compactCards: boolean;
  saveHistory: boolean;
};

const DEFAULT_SETTINGS: SettingsState = {
  notifications: true,
  offers: true,
  reservations: true,
  showImages: true,
  compactCards: false,
  saveHistory: true,
};

const STORAGE_KEY = "menu-v3-settings";

export default function MenuV3SettingsPage() {
  const { dir, lang, toggleLang } = useLanguage();
  const [theme, setTheme] = useState<MenuTheme>("light");
  const [settings, setSettings] = useState<SettingsState>(DEFAULT_SETTINGS);
  const [hydrated, setHydrated] = useState(false);
  const headingFont = lang === "ar" ? tajawal.className : playfair.className;
  const backIcon = dir === "rtl" ? "→" : "←";

  const themeVars = useMemo(
    () =>
      ({
        "--v3-cream": theme === "dark" ? "#252b27" : "#f8f4ee",
        "--v3-ink": theme === "dark" ? "#f4efe7" : "#2a2f2c",
        "--v3-muted": theme === "dark" ? "#d0c6bb" : "#7a6f65",
        "--v3-accent": theme === "dark" ? "#e18b6b" : "#b85d3d",
        "--v3-olive": theme === "dark" ? "#95a69f" : "#50615a",
        "--v3-bg":
          theme === "dark"
            ? "radial-gradient(70% 40% at 15% 0%, rgba(96, 69, 49, 0.35) 0%, rgba(37, 43, 39, 0) 60%), radial-gradient(80% 45% at 85% 0%, rgba(65, 88, 74, 0.35) 0%, rgba(37, 43, 39, 0) 65%), linear-gradient(180deg, #252b27 0%, #1f2421 55%, #1b1f1d 100%)"
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

    if (typeof window !== "undefined") {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (raw) {
        try {
          const parsed = JSON.parse(raw) as Partial<SettingsState>;
          setSettings((prev) => ({ ...prev, ...parsed }));
        } catch {
          setSettings(DEFAULT_SETTINGS);
        }
      }
    }

    setHydrated(true);
    return () => {
      document.body.classList.remove(className);
      document.documentElement.classList.remove(className);
      document.body.classList.remove("menu-v3-dark");
      document.documentElement.classList.remove("menu-v3-dark");
    };
  }, []);

  useEffect(() => {
    if (!hydrated || typeof window === "undefined") {
      return;
    }
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
  }, [hydrated, settings]);

  const updateSetting = (key: keyof SettingsState) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      className={`${headingFont} relative min-h-screen text-[17px] sm:text-[19px] text-[color:var(--v3-ink)]`}
      dir={dir}
      style={themeVars}
    >
      <div className="absolute inset-0 -z-10" style={{ background: "var(--v3-bg)" }} />
      <div className="pointer-events-none absolute -top-32 left-10 h-64 w-64 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(232,161,127,0.35),transparent_65%)] blur-2xl" />
      <div className="pointer-events-none absolute right-10 top-40 h-72 w-72 rounded-full bg-[radial-gradient(circle_at_30%_30%,rgba(123,156,140,0.35),transparent_65%)] blur-2xl" />

      <div className="mx-auto max-w-5xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <header className="sticky top-0 z-40 -mx-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/70 bg-[color:var(--v3-cream)]/90 px-4 py-3 backdrop-blur sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8">
          <Link
            href="/menu-v3"
            className="flex items-center gap-2 rounded-full bg-white px-4 py-2 text-xs font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
          >
            <span className="text-sm">{backIcon}</span>
            {lang === "ar" ? "العودة للمنيو" : "Back to Menu"}
          </Link>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={toggleLang}
              className="h-10 w-10 rounded-full bg-white text-sm font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
              aria-label={lang === "ar" ? "English" : "العربية"}
              title={lang === "ar" ? "English" : "العربية"}
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
          </div>
        </header>

        <section className="mt-10 rounded-[36px] border border-white/70 bg-white/80 p-6 shadow-[0_22px_40px_rgba(15,23,42,0.12)] sm:p-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[color:var(--v3-muted)]">
                {lang === "ar" ? "لوحة التفضيلات" : "Preferences"}
              </p>
              <h1 className={`mt-2 text-2xl font-semibold sm:text-3xl ${headingFont}`}>
                {lang === "ar" ? "الإعدادات" : "Settings"}
              </h1>
              <p className="mt-2 max-w-xl text-sm text-[color:var(--v3-muted)]">
                {lang === "ar"
                  ? "خصص تجربة التصفح كما تحب مع نفس ألوان وهوية المنيو."
                  : "Personalize your browsing experience while keeping the menu’s signature style."}
              </p>
            </div>
            <div className="rounded-[24px] border border-white/60 bg-white/85 px-4 py-3 text-sm font-semibold text-[color:var(--v3-ink)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]">
              {lang === "ar" ? "جاهز للتخصيص" : "Ready to customize"}
            </div>
          </div>
        </section>

        <div className="mt-8 grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <section className="rounded-[32px] border border-white/60 bg-white/85 px-5 py-7 shadow-[0_18px_35px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8">
            <h2 className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "المظهر واللغة" : "Appearance & Language"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--v3-muted)]">
              {lang === "ar"
                ? "اختر الشكل المناسب وبدّل اللغة بسهولة."
                : "Choose your preferred look and switch language instantly."}
            </p>

            <div className="mt-6 space-y-4">
              <SettingRow
                label={lang === "ar" ? "لغة الواجهة" : "Interface language"}
                description={lang === "ar" ? "بدّل بين العربية والإنجليزية." : "Switch between Arabic and English."}
                value={lang === "ar" ? "العربية" : "English"}
                action={
                  <button
                    type="button"
                    onClick={toggleLang}
                    className="rounded-full bg-[color:var(--v3-accent)] px-4 py-2 text-xs font-semibold text-white shadow-[0_12px_24px_rgba(184,93,61,0.35)]"
                  >
                    {lang === "ar" ? "تغيير" : "Change"}
                  </button>
                }
              />

              <SettingRow
                label={lang === "ar" ? "وضع العرض" : "Theme mode"}
                description={
                  lang === "ar"
                    ? "اختر مظهر فاتح أو داكن."
                    : "Pick a light or dark ambiance."
                }
                value={
                  theme === "dark"
                    ? lang === "ar"
                      ? "داكن"
                      : "Dark"
                    : lang === "ar"
                      ? "فاتح"
                      : "Light"
                }
                action={
                  <button
                    type="button"
                    onClick={toggleTheme}
                    className="rounded-full border border-white/70 bg-white/80 px-4 py-2 text-xs font-semibold text-[color:var(--v3-accent)] shadow-[0_12px_24px_rgba(15,23,42,0.12)]"
                  >
                    {lang === "ar" ? "تبديل" : "Toggle"}
                  </button>
                }
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-white/60 bg-white/85 px-5 py-7 shadow-[0_18px_35px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8">
            <h2 className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "الإشعارات" : "Notifications"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--v3-muted)]">
              {lang === "ar" ? "تحكّم في التنبيهات التي تصلك." : "Control which alerts you receive."}
            </p>

            <div className="mt-6 space-y-4">
              <ToggleRow
                label={lang === "ar" ? "تحديثات الطلب" : "Order updates"}
                description={lang === "ar" ? "تنبيهات حالة الطلب والجاهزية." : "Get status updates and readiness alerts."}
                value={settings.notifications}
                onToggle={() => updateSetting("notifications")}
              />
              <ToggleRow
                label={lang === "ar" ? "العروض الخاصة" : "Special offers"}
                description={lang === "ar" ? "عروض وخصومات يومية." : "Daily deals and discounts."}
                value={settings.offers}
                onToggle={() => updateSetting("offers")}
              />
              <ToggleRow
                label={lang === "ar" ? "تنبيهات الحجوزات" : "Reservation reminders"}
                description={lang === "ar" ? "تذكير بمواعيد الحجز." : "Reminders for upcoming reservations."}
                value={settings.reservations}
                onToggle={() => updateSetting("reservations")}
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-white/60 bg-white/85 px-5 py-7 shadow-[0_18px_35px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8">
            <h2 className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "تفضيلات العرض" : "Display preferences"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--v3-muted)]">
              {lang === "ar" ? "اضبط طريقة عرض المنتجات." : "Tune how menu items appear."}
            </p>

            <div className="mt-6 space-y-4">
              <ToggleRow
                label={lang === "ar" ? "إظهار الصور" : "Show images"}
                description={lang === "ar" ? "عرض صور المنتجات داخل القائمة." : "Display item images in the menu."}
                value={settings.showImages}
                onToggle={() => updateSetting("showImages")}
              />
              <ToggleRow
                label={lang === "ar" ? "عرض مُختصر" : "Compact cards"}
                description={lang === "ar" ? "تصغير البطاقات لعرض المزيد." : "Show more items in a compact layout."}
                value={settings.compactCards}
                onToggle={() => updateSetting("compactCards")}
              />
            </div>
          </section>

          <section className="rounded-[32px] border border-white/60 bg-white/85 px-5 py-7 shadow-[0_18px_35px_rgba(15,23,42,0.12)] sm:px-6 sm:py-8">
            <h2 className={`text-lg font-semibold ${headingFont}`}>
              {lang === "ar" ? "الخصوصية" : "Privacy"}
            </h2>
            <p className="mt-2 text-sm text-[color:var(--v3-muted)]">
              {lang === "ar" ? "تحكم في حفظ النشاط داخل الحساب." : "Manage how activity is stored."}
            </p>

            <div className="mt-6 space-y-4">
              <ToggleRow
                label={lang === "ar" ? "حفظ سجل الطلبات" : "Save order history"}
                description={
                  lang === "ar"
                    ? "يساعدك على العودة لطلباتك السابقة."
                    : "Keep a quick reference to previous orders."}
                value={settings.saveHistory}
                onToggle={() => updateSetting("saveHistory")}
              />
            </div>
          </section>
        </div>
      </div>

      <style jsx global>{`
        .menu-v3-skin {
          background: var(--v3-cream) !important;
          color: var(--v3-ink);
        }
        body.menu-v3-skin {
          background: var(--v3-cream) !important;
        }
        html.menu-v3-skin {
          background: var(--v3-cream) !important;
        }
      `}</style>
    </div>
  );
}

type SettingRowProps = {
  label: string;
  description: string;
  value: string;
  action: ReactNode;
};

function SettingRow({ label, description, value, action }: SettingRowProps) {
  return (
    <div className="rounded-[22px] border border-white/70 bg-white/85 px-4 py-3 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-semibold text-[color:var(--v3-ink)]">{label}</p>
          <p className="text-xs text-[color:var(--v3-muted)]">{description}</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs font-semibold text-[color:var(--v3-muted)]">{value}</span>
          {action}
        </div>
      </div>
    </div>
  );
}

type ToggleRowProps = {
  label: string;
  description: string;
  value: boolean;
  onToggle: () => void;
};

function ToggleRow({ label, description, value, onToggle }: ToggleRowProps) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-[22px] border border-white/70 bg-white/85 px-4 py-3 shadow-[0_10px_20px_rgba(15,23,42,0.08)]">
      <div>
        <p className="text-sm font-semibold text-[color:var(--v3-ink)]">{label}</p>
        <p className="text-xs text-[color:var(--v3-muted)]">{description}</p>
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={value}
        onClick={onToggle}
        className={`relative h-8 w-14 rounded-full border transition ${
          value
            ? "border-[color:var(--v3-accent)] bg-[color:var(--v3-accent)]"
            : "border-white/60 bg-[color:var(--v3-cream)]"
        }`}
      >
        <span
          className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow-[0_6px_12px_rgba(15,23,42,0.2)] transition ${
            value ? "right-1" : "left-1"
          }`}
        />
      </button>
    </div>
  );
}
