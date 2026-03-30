"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { FiBell, FiGlobe, FiLogOut, FiMenu, FiPlus, FiSearch } from "react-icons/fi";
import { getLocalizedText } from "../lib/i18n";
import { clearAccessToken } from "../services/api-client";
import { fetchCurrentUser } from "../services/admin-api";
import {
  clearMenuNotifications,
  getMenuNotifications,
  markMenuNotificationRead,
  subscribeMenuNotifications,
  type MenuNotification,
} from "../lib/menu-notifications";

type DashboardNavbarProps = {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
};

export default function DashboardNavbar({
  onToggleSidebar,
  showSidebarToggle = false,
}: DashboardNavbarProps) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(true);
  const [userLabel, setUserLabel] = useState("أحمد محمد");
  const [showNotifications, setShowNotifications] = useState(false);
  const [menuNotifications, setMenuNotifications] = useState<MenuNotification[]>([]);
  const bellRef = useRef<HTMLDivElement | null>(null);

  const userInitial = useMemo(() => {
    const value = userLabel.trim();
    if (!value) {
      return "؟";
    }
    if (value.includes("@")) {
      return value[0]?.toUpperCase() ?? "؟";
    }
    const parts = value.split(/\s+/).filter(Boolean);
    return parts[0]?.[0] ?? "؟";
  }, [userLabel]);

  useEffect(() => {
    const stored = window.localStorage.getItem("restaurant_open");
    if (stored === "false") {
      setIsOpen(false);
    }
  }, []);

  useEffect(() => {
    setMenuNotifications(getMenuNotifications());
    return subscribeMenuNotifications(setMenuNotifications);
  }, []);

  useEffect(() => {
    if (!showNotifications) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      if (!bellRef.current) return;
      if (bellRef.current.contains(event.target as Node)) return;
      setShowNotifications(false);
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setShowNotifications(false);
      }
    };

    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [showNotifications]);

  useEffect(() => {
    let mounted = true;
    const loadUser = async () => {
      const me = await fetchCurrentUser();
      if (!mounted || !me) {
        return;
      }
      const label = me.full_name?.trim() || me.email?.trim() || "أحمد محمد";
      setUserLabel(label);
    };
    loadUser();
    return () => {
      mounted = false;
    };
  }, []);

  const toggleStatus = () => {
    setIsOpen((prev) => {
      const next = !prev;
      window.localStorage.setItem("restaurant_open", next ? "true" : "false");
      window.dispatchEvent(
        new CustomEvent("app:restaurant-status", { detail: { open: next } })
      );
      if (!next) {
        window.dispatchEvent(
          new CustomEvent("app:toast", {
            detail: { message: "المطعم مغلق الآن", tone: "danger" },
          })
        );
      }
      return next;
    });
  };

  const handleLogout = () => {
    clearAccessToken();
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("restaurant_refresh_token");
    }
    router.replace("/login");
  };

  const unreadCount = useMemo(
    () => menuNotifications.filter((item) => !item.read).length,
    [menuNotifications]
  );

  return (
    <header className="rounded-3xl border border-slate-200 bg-white/80 px-4 py-4 shadow-sm backdrop-blur sm:px-5">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="order-1 flex items-center justify-between gap-3 lg:order-1">
          <div className="text-right">
            <p className="text-sm font-semibold text-slate-900">لوحة التحكم</p>
            <p className="text-xs text-slate-400">الرئيسية / لوحة التحكم</p>
          </div>
          {showSidebarToggle ? (
            <button
              type="button"
              onClick={onToggleSidebar}
              className="grid h-10 w-10 place-items-center rounded-full border border-slate-200 text-slate-600 lg:hidden"
              aria-label="فتح القائمة"
            >
              <FiMenu />
            </button>
          ) : null}
        </div>

        <div className="order-2 w-full flex-1 lg:order-2">
          <label className="flex w-full items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
            <FiSearch />
            <input
              type="text"
              placeholder="ابحث عن طلب..."
              className="w-full bg-transparent text-right outline-none"
            />
          </label>
        </div>

        <div className="order-3 flex flex-wrap items-center justify-end gap-3 lg:order-3">
          <button
            type="button"
            onClick={toggleStatus}
            className={`flex items-center gap-2 rounded-full px-3 py-2 text-sm font-semibold text-white transition ${
              isOpen
                ? "bg-emerald-600 hover:bg-emerald-500"
                : "bg-rose-600 hover:bg-rose-500"
            }`}
            aria-pressed={!isOpen}
          >
            <span className="h-2 w-2 rounded-full bg-white/80" />
            {isOpen ? "مفتوح" : "مغلق"}
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600">
            <FiPlus />
          </button>
          <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600">
            <FiGlobe />
          </button>
          <div className="relative" ref={bellRef}>
            <button
              type="button"
              onClick={() => setShowNotifications((prev) => !prev)}
              className={`grid h-9 w-9 place-items-center rounded-full border text-slate-500 transition ${
                showNotifications
                  ? "border-emerald-200 text-emerald-600"
                  : "border-slate-200 hover:border-emerald-200 hover:text-emerald-600"
              }`}
              aria-label="الإشعارات"
              title="الإشعارات"
            >
              <FiBell />
            </button>
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 grid h-4 min-w-[16px] place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-semibold text-white">
                {unreadCount > 9 ? "9+" : unreadCount}
              </span>
            )}

            {showNotifications && (
              <div className="absolute right-0 top-12 z-40 w-[320px] translate-x-3 rounded-2xl border border-slate-200 bg-white p-3 shadow-[0_18px_40px_rgba(15,23,42,0.18)]">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-slate-900">
                      إشعارات المنيو
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {unreadCount} غير مقروءة
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={clearMenuNotifications}
                    className="rounded-full border border-rose-200 bg-rose-50 px-3 py-1 text-[11px] font-semibold text-rose-600"
                  >
                    مسح الكل
                  </button>
                </div>

                <div className="mt-3 max-h-72 space-y-2 overflow-auto pr-1">
                  {menuNotifications.length === 0 ? (
                    <div className="rounded-xl bg-slate-50 px-3 py-3 text-xs text-slate-500">
                      لا توجد إشعارات حتى الآن.
                    </div>
                  ) : (
                    menuNotifications.slice(0, 6).map((item) => (
                      <div
                        key={item.id}
                        className={`rounded-xl border px-3 py-2 text-xs ${
                          item.read
                            ? "border-slate-200 bg-white"
                            : "border-emerald-200 bg-emerald-50/60"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-1 text-right">
                            <p className="font-semibold text-slate-900">
                              {getLocalizedText(item.title, "ar")}
                            </p>
                            <p className="text-[11px] text-slate-500">
                              {getLocalizedText(item.body, "ar")}
                            </p>
                            <p className="text-[10px] text-slate-400">
                              {new Date(item.createdAt).toLocaleString("ar-EG")}
                            </p>
                          </div>
                          <button
                            type="button"
                            onClick={() => markMenuNotificationRead(item.id)}
                            className="rounded-full border border-slate-200 px-2 py-1 text-[10px] font-semibold text-slate-600"
                          >
                            مقروء
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
          <button
            type="button"
            onClick={handleLogout}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500 transition hover:border-rose-200 hover:text-rose-600"
            aria-label="تسجيل الخروج"
            title="تسجيل الخروج"
          >
            <FiLogOut />
          </button>
          <div className="flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1.5 text-sm font-semibold text-slate-700">
            <span className="grid h-8 w-8 place-items-center rounded-full bg-emerald-500 text-white">
              {userInitial}
            </span>
            {userLabel}
          </div>
        </div>
      </div>
    </header>
  );
}
