"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FiBox,
  FiCalendar,
  FiCoffee,
  FiCreditCard,
  FiGift,
  FiGrid,
  FiLayout,
  FiPhoneCall,
  FiCode,
  FiSettings,
  FiShoppingCart,
  FiTag,
  FiUsers,
  FiX,
} from "react-icons/fi";

const sidebarItems = [
  { label: "لوحة التحكم", href: "/dashboard", Icon: FiGrid },
  { label: "المنتجات", href: "/products", Icon: FiBox },
  { label: "التصنيفات", href: "/categories", Icon: FiTag },
  { label: "العروض", href: "/offers", Icon: FiGift },
  { label: "الطاولات", href: "/tables", Icon: FiLayout },
  { label: "الطلبات", href: "/orders", Icon: FiShoppingCart },
  { label: "طلبات النادل", href: "/calls", Icon: FiPhoneCall },
  { label: "الحجوزات", href: "/reservations", Icon: FiCalendar },
  { label: "المدفوعات", href: "/payments", Icon: FiCreditCard },
  { label: "مولد QR", href: "/qr", Icon: FiCode },
  { label: "المستخدمون", href: "/users", Icon: FiUsers },
  { label: "الإعدادات", href: "/settings", Icon: FiSettings },
];

type DashboardSidebarProps = {
  className?: string;
  showClose?: boolean;
  onClose?: () => void;
};

export default function DashboardSidebar({
  className = "",
  showClose = false,
  onClose,
}: DashboardSidebarProps) {
  const pathname = usePathname();

  return (
    <aside
      className={`h-fit rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm lg:order-1 lg:sticky lg:top-6 ${className}`}
    >
      <div className="flex items-start justify-between gap-3">
        {showClose ? (
          <button
            type="button"
            onClick={onClose}
            className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-600 lg:hidden"
            aria-label="إغلاق القائمة"
          >
            <FiX />
          </button>
        ) : (
          <span className="h-9 w-9" />
        )}
        <div className="flex flex-row-reverse items-center justify-end gap-3 text-right">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-white">
            <FiCoffee />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-900">مطعم الذواقة</p>
            <p className="text-xs text-slate-400">لوحة التحكم</p>
          </div>
        </div>
      </div>

      <nav
        className="mt-6 flex flex-col gap-2"
        dir="rtl"
      >
        {sidebarItems.map((item) => {
          const isActive =
            pathname === item.href ||
            (pathname?.startsWith(`${item.href}/`) ?? false);
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex shrink-0 items-center gap-3 whitespace-nowrap rounded-2xl px-4 py-3 text-right text-sm font-semibold transition lg:w-full ${
                isActive
                  ? "bg-emerald-500 text-white shadow-sm"
                  : "text-slate-600 hover:bg-emerald-50 hover:text-emerald-700"
              }`}
            >
              <item.Icon className="text-lg" />
              <span className="flex-1">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="mt-4 flex items-center justify-between text-xs text-slate-400 lg:mt-6">
        <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500">
          ع
        </button>
        <span>v1.0.0</span>
      </div>
    </aside>
  );
}
