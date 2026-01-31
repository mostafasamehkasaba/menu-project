"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Cairo } from "next/font/google";
import { usePathname } from "next/navigation";
import { categories, menuItems } from "../lib/menu-data";
import { formatCurrency, getLocalizedText } from "../lib/i18n";
import { useLanguage } from "../components/language-provider";
import {
  FiBox,
  FiCalendar,
  FiCoffee,
  FiCreditCard,
  FiEdit2,
  FiGift,
  FiGrid,
  FiLayout,
  FiPhoneCall,
  FiSearch,
  FiSettings,
  FiShoppingCart,
  FiTag,
  FiTrash2,
  FiUsers,
  FiPlus,
} from "react-icons/fi";

const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "600", "700"],
});

export default function ProductsPage() {
  const pathname = usePathname();
  const { lang, dir } = useLanguage();
  const [query, setQuery] = useState("");
  const [activeIds, setActiveIds] = useState<Set<number>>(
    () => new Set(menuItems.map((item) => item.id))
  );

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => {
      if (category.id === "all") {
        return;
      }
      map.set(category.id, getLocalizedText(category.label, lang));
    });
    return map;
  }, [lang]);

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return menuItems;
    }

    return menuItems.filter((item) => {
      const name = getLocalizedText(item.name, lang).toLowerCase();
      const categoryLabel = categoryMap.get(item.category)?.toLowerCase() ?? "";
      return (
        name.includes(normalizedQuery) ||
        categoryLabel.includes(normalizedQuery)
      );
    });
  }, [query, lang, categoryMap]);

  const toggleActive = (id: number) => {
    setActiveIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  const sidebarItems = [
    { label: "لوحة التحكم", href: "/dashboard", Icon: FiGrid },
    { label: "المنتجات", href: "/products", Icon: FiBox },
    { label: "التصنيفات", href: "/categories", Icon: FiTag },
    { label: "العروض", href: "/offers", Icon: FiGift },
    { label: "الطاولات", href: "/tables", Icon: FiLayout },
    { label: "الطلبات", href: "/orders", Icon: FiShoppingCart },
    { label: "طلبات النداء", href: "/calls", Icon: FiPhoneCall },
    { label: "الحجوزات", href: "/reservations", Icon: FiCalendar },
    { label: "المدفوعات", href: "/payments", Icon: FiCreditCard },
    { label: "المستخدمون", href: "/users", Icon: FiUsers },
    { label: "الإعدادات", href: "/settings", Icon: FiSettings },
  ];

  return (
    <div
      className={`${cairo.className} min-h-screen bg-[radial-gradient(circle_at_5%_0%,#f0fdf4,transparent_45%),radial-gradient(circle_at_95%_20%,#eef2ff,transparent_45%),linear-gradient(180deg,#f8fafc_0%,#ffffff_45%,#ffffff_100%)] text-slate-900`}
      dir={dir}
    >
      <div className="grid min-h-screen w-full gap-6 px-6 py-6 lg:grid-cols-[1fr_280px] lg:px-10">
        <main className="space-y-6">
          <header className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div className="order-1 text-right lg:order-1">
                <p className="text-sm font-semibold text-slate-900">
                  إدارة المنتجات
                </p>
                <p className="text-xs text-slate-400">
                  {menuItems.length} منتج
                </p>
              </div>

              <div className="order-2 flex-1 lg:order-2">
                <label className="flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-500">
                  <FiSearch />
                  <input
                    type="text"
                    placeholder="بحث عن منتج..."
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                    className="w-full bg-transparent text-right outline-none"
                  />
                </label>
              </div>

              <div className="order-3 flex items-center justify-start lg:order-3 lg:justify-end">
                <button className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5">
                  <FiPlus />
                  إضافة منتج
                </button>
              </div>
            </div>
          </header>

          <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="overflow-x-auto">
              <div className="min-w-[980px]">
                <div className="grid grid-cols-[0.9fr_0.7fr_0.8fr_0.8fr_0.9fr_minmax(0,1.6fr)] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
                  <div className="text-right">الإجراءات</div>
                  <div className="text-right">متاح</div>
                  <div className="text-right">العلامات</div>
                  <div className="text-right">السعر</div>
                  <div className="text-right">التصنيف</div>
                  <div className="text-right">المنتج</div>
                </div>

                {filteredItems.map((item) => {
                  const isActive = activeIds.has(item.id);
                  const name = getLocalizedText(item.name, lang);
                  const categoryLabel =
                    categoryMap.get(item.category) ?? item.category;

                  return (
                    <div
                      key={item.id}
                      className="grid grid-cols-[0.9fr_0.7fr_0.8fr_0.8fr_0.9fr_minmax(0,1.6fr)] items-center border-b border-slate-100 px-5 py-4 text-sm text-slate-700 last:border-b-0"
                    >
                      <div className="flex items-center justify-end gap-2">
                        <button className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600">
                          <FiEdit2 />
                          تعديل
                        </button>
                        <button className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-rose-500">
                          <FiTrash2 />
                        </button>
                      </div>

                      <div className="flex items-center justify-end">
                        <label className="relative inline-flex cursor-pointer items-center">
                          <input
                            type="checkbox"
                            checked={isActive}
                            onChange={() => toggleActive(item.id)}
                            className="peer sr-only"
                          />
                          <span className="h-6 w-11 rounded-full bg-slate-200 transition peer-checked:bg-emerald-500" />
                          <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition peer-checked:translate-x-5" />
                        </label>
                      </div>

                      <div className="flex flex-wrap justify-end gap-2">
                        {item.tag ? (
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-semibold ${
                              item.tag === "new"
                                ? "bg-blue-50 text-blue-600"
                                : "bg-rose-50 text-rose-600"
                            }`}
                          >
                            {item.tag === "new" ? "جديد" : "حار"}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-300">-</span>
                        )}
                      </div>

                      <div className="text-right font-semibold text-slate-900">
                        {formatCurrency(item.price, lang)}
                      </div>

                      <div className="text-right text-sm text-slate-600">
                        <span className="rounded-full border border-slate-200 px-3 py-1 text-xs">
                          {categoryLabel}
                        </span>
                      </div>

                      <div className="flex items-center justify-end gap-4 text-right">
                        <img
                          src={item.image}
                          alt={name}
                          className="h-12 w-12 rounded-2xl object-cover shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
                          loading="lazy"
                        />
                        <div>
                          <p className="font-semibold text-slate-900">{name}</p>
                          <p className="text-xs text-slate-400">#{item.id}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </main>

        <aside className="h-fit rounded-3xl border border-slate-200 bg-white px-4 py-6 shadow-sm lg:sticky lg:top-6">
          <div className="flex items-center justify-between gap-4 text-right">
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-emerald-500 text-white">
              <FiCoffee />
            </div>
            <div>
              <p className="text-sm font-semibold text-slate-900">
                مطعم الذواقة
              </p>
              <p className="text-xs text-slate-400">لوحة التحكم</p>
            </div>
          </div>

          <nav className="mt-6 space-y-2" dir="rtl">
            {sidebarItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.label}
                  href={item.href}
                  className={`flex items-center gap-3 rounded-2xl px-4 py-3 text-right text-sm font-semibold transition ${
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

          <div className="mt-6 flex items-center justify-between text-xs text-slate-400">
            <button className="grid h-9 w-9 place-items-center rounded-full border border-slate-200 text-slate-500">
              ?
            </button>
            <span>v1.0.0</span>
          </div>
        </aside>
      </div>
    </div>
  );
}
