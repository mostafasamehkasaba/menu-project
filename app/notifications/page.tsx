"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import type { LocalizedText } from "../lib/i18n";
import { getLocalizedText } from "../lib/i18n";
import { useLanguage } from "../components/language-provider";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

type NotificationItem = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  time: LocalizedText;
  icon: string;
  iconBg: string;
  read: boolean;
};

const initialNotifications: NotificationItem[] = [
  {
    id: "n1",
    title: { ar: "تم تأكيد طلبك", en: "Order confirmed" },
    body: {
      ar: "تم تأكيد طلبك #1234 وجاري التحضير الآن",
      en: "Your order #1234 is confirmed and being prepared.",
    },
    time: { ar: "منذ 5 دقائق", en: "5 min ago" },
    icon: "🔒",
    iconBg: "bg-emerald-500",
    read: false,
  },
  {
    id: "n2",
    title: { ar: "عرض خاص لك!", en: "Special offer for you!" },
    body: {
      ar: "احصل على خصم 30% على جميع الوجبات الرئيسية اليوم",
      en: "Get 30% off all main dishes today.",
    },
    time: { ar: "منذ ساعة", en: "1 hour ago" },
    icon: "🎁",
    iconBg: "bg-orange-500",
    read: false,
  },
  {
    id: "n3",
    title: { ar: "عرض محدود", en: "Limited offer" },
    body: {
      ar: "اشترِ 2 واحصل على 1 مجانًا على جميع المشروبات",
      en: "Buy 2 and get 1 free on all drinks.",
    },
    time: { ar: "منذ يومين", en: "2 days ago" },
    icon: "%",
    iconBg: "bg-rose-500",
    read: true,
  },
];

export default function NotificationsPage() {
  const { dir, lang, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<"unread" | "all">("all");
  const [notifications, setNotifications] = useState(initialNotifications);

  const unreadCount = useMemo(
    () => notifications.filter((item) => !item.read).length,
    [notifications]
  );

  const visibleNotifications = useMemo(() => {
    if (activeTab === "unread") {
      return notifications.filter((item) => !item.read);
    }
    return notifications;
  }, [activeTab, notifications]);

  const handleMarkRead = (id: string) => {
    setNotifications((items) =>
      items.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  };

  const handleMarkAllRead = () => {
    setNotifications((items) =>
      items.map((item) => ({ ...item, read: true }))
    );
  };

  const backIcon = dir === "rtl" ? "→" : "←";

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[#f7f7f8] text-slate-900`}
      dir={dir}
    >
      <div className="mx-auto max-w-5xl px-4 pb-28 pt-6 sm:px-6 lg:px-8">
        <header className="flex items-center justify-between gap-4">
          <button
            type="button"
            onClick={handleMarkAllRead}
            disabled={unreadCount === 0}
            className={`text-sm font-semibold ${
              unreadCount === 0 ? "text-slate-300" : "text-orange-600"
            }`}
          >
            {t("markAllRead")}
          </button>

          <div className="text-center">
            <h1 className="text-lg font-semibold sm:text-xl">
              {t("notifications")}
            </h1>
            <p className="text-xs text-slate-500">
              {t("unreadNotifications")} {unreadCount}
            </p>
          </div>

          <Link
            href="/account"
            className="grid h-10 w-10 place-items-center rounded-full bg-white text-lg text-slate-600 shadow-[0_12px_24px_rgba(15,23,42,0.08)]"
            aria-label={t("backToAccount")}
          >
            {backIcon}
          </Link>
        </header>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setActiveTab("unread")}
            className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${
              activeTab === "unread"
                ? "bg-orange-500 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {t("unread")} ({unreadCount})
          </button>
          <button
            type="button"
            onClick={() => setActiveTab("all")}
            className={`flex-1 rounded-full px-5 py-3 text-sm font-semibold shadow-[0_10px_24px_rgba(15,23,42,0.08)] ${
              activeTab === "all"
                ? "bg-orange-500 text-white"
                : "bg-slate-100 text-slate-500"
            }`}
          >
            {t("allNotifications")} ({notifications.length})
          </button>
        </div>

        <div className="mt-8 space-y-4">
          {visibleNotifications.length === 0 ? (
            <div className="rounded-3xl bg-white p-6 text-center text-sm text-slate-500 shadow-[0_14px_30px_rgba(15,23,42,0.08)]">
              {t("noNotifications")}
            </div>
          ) : (
            visibleNotifications.map((item) => (
              <article
                key={item.id}
                className={`relative rounded-[28px] border bg-white p-6 shadow-[0_14px_30px_rgba(15,23,42,0.08)] ${
                  item.read ? "border-slate-200" : "border-orange-200"
                }`}
              >
                {!item.read && (
                  <span
                    className={`absolute top-6 h-2 w-2 rounded-full bg-orange-500 ${
                      dir === "rtl" ? "right-6" : "left-6"
                    }`}
                  />
                )}

                <div
                  className={`flex items-start justify-between gap-4 ${
                    dir === "rtl" ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`flex flex-1 flex-col gap-2 ${
                      dir === "rtl" ? "text-end" : "text-start"
                    }`}
                  >
                    <h2 className="text-base font-semibold text-slate-900">
                      {getLocalizedText(item.title, lang)}
                    </h2>
                    <p className="text-sm text-slate-500">
                      {getLocalizedText(item.body, lang)}
                    </p>
                    <p className="text-xs text-slate-400">
                      {getLocalizedText(item.time, lang)}
                    </p>

                    {!item.read && (
                      <button
                        type="button"
                        onClick={() => handleMarkRead(item.id)}
                        className="mt-2 inline-flex items-center gap-2 text-xs font-semibold text-orange-600"
                      >
                        <span className="text-sm">✓</span>
                        {t("markRead")}
                      </button>
                    )}
                  </div>

                  <div
                    className={`grid h-12 w-12 place-items-center rounded-full text-xl text-white ${item.iconBg}`}
                  >
                    {item.icon}
                  </div>
                </div>
              </article>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
