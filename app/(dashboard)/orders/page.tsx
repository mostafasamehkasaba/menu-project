"use client";

import { useState } from "react";
import {
  FiCheckCircle,
  FiClock,
  FiMapPin,
  FiPackage,
  FiSearch,
} from "react-icons/fi";

type OrderStatus = "new" | "preparing" | "served" | "canceled";

type Order = {
  id: number;
  amount: number;
  minutes: number;
  time: string;
  type: "داخل المطعم" | "توصيل";
  table?: number;
  status: OrderStatus;
  paid: boolean;
  partialPaid?: string;
};

const orders: Order[] = [
  {
    id: 1245,
    amount: 285,
    minutes: 20,
    time: "14:30",
    type: "داخل المطعم",
    table: 5,
    status: "new",
    paid: false,
  },
  {
    id: 1244,
    amount: 175,
    minutes: 10,
    time: "14:15",
    type: "داخل المطعم",
    table: 2,
    status: "preparing",
    paid: false,
    partialPaid: "(ريال 100 / 175)",
  },
  {
    id: 1243,
    amount: 95,
    minutes: 5,
    time: "14:00",
    type: "توصيل",
    status: "preparing",
    paid: true,
  },
  {
    id: 1242,
    amount: 420,
    minutes: 15,
    time: "13:45",
    type: "داخل المطعم",
    table: 8,
    status: "served",
    paid: false,
  },
];

const statusPills: Record<OrderStatus, { label: string; className: string }> =
  {
    new: { label: "جديد", className: "bg-blue-50 text-blue-600" },
    preparing: { label: "قيد التحضير", className: "bg-orange-50 text-orange-600" },
    served: { label: "تم التقديم", className: "bg-emerald-50 text-emerald-600" },
    canceled: { label: "ملغي", className: "bg-slate-100 text-slate-500" },
  };

const filterTabs: { key: "all" | OrderStatus; label: string; count: number }[] =
  [
    { key: "all", label: "الكل", count: 4 },
    { key: "new", label: "جديد", count: 1 },
    { key: "preparing", label: "قيد التحضير", count: 2 },
    { key: "served", label: "تم التقديم", count: 1 },
    { key: "canceled", label: "ملغي", count: 0 },
  ];

export default function OrdersPage() {
  const [activeTab, setActiveTab] = useState<"all" | OrderStatus>("all");
  const filtered =
    activeTab === "all"
      ? orders
      : orders.filter((order) => order.status === activeTab);

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
      <section className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm">
          <div className="flex flex-wrap items-center gap-2">
            {filterTabs.map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold ${
                  activeTab === tab.key
                    ? "bg-slate-100 text-slate-900"
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                <span>{tab.label}</span>
                <span className="grid h-6 w-6 place-items-center rounded-full bg-white text-xs text-slate-600 shadow-sm">
                  {tab.count}
                </span>
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
            <FiSearch />
            <input
              type="text"
              placeholder="ابحث عن طلب..."
              className="w-44 bg-transparent text-right outline-none sm:w-56"
            />
          </div>
        </div>

        <div className="space-y-4">
          {filtered.map((order, index) => {
            const status = statusPills[order.status];
            return (
              <div
                key={order.id}
                className={`rounded-2xl border border-slate-200 bg-white p-4 shadow-sm ${
                  index === 0 ? "border-emerald-500" : ""
                }`}
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-900">
                      طلب #{order.id}
                    </div>
                    <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1">
                        <FiClock />
                        {order.time}
                      </span>
                      {order.table ? (
                        <span className="flex items-center gap-1">
                          <FiMapPin />
                          طاولة {order.table}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FiMapPin />
                          {order.type}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                      >
                        {status.label}
                      </span>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${
                          order.paid
                            ? "bg-emerald-50 text-emerald-600"
                            : "bg-rose-50 text-rose-600"
                        }`}
                      >
                        {order.paid ? "مدفوع" : "غير مدفوع"}
                      </span>
                      {order.partialPaid ? (
                        <span className="text-xs text-slate-500">
                          {order.partialPaid}
                        </span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-right">
                    <p className="text-sm font-semibold text-slate-900">
                      ر.س {order.amount}
                    </p>
                    <p className="text-xs text-slate-400">
                      {order.minutes} دقيقة
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <aside className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">تفاصيل الطلب</p>
        </div>

        <div className="mt-5 space-y-4 text-sm">
          <div className="flex items-center justify-between text-slate-500">
            <span>رقم الطلب</span>
            <span className="font-semibold text-slate-900">#1245</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>النوع</span>
            <span className="font-semibold text-slate-900">في المطعم</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>الطاولة</span>
            <span className="font-semibold text-slate-900">5</span>
          </div>
          <div className="flex items-center justify-between text-slate-500">
            <span>الوقت</span>
            <span className="font-semibold text-slate-900">14:30</span>
          </div>
        </div>

        <hr className="my-5 border-slate-200" />

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">حالة الطلب</p>
        </div>
        <div className="mt-4 space-y-4 text-sm">
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="font-semibold text-slate-900">تم الاستلام</p>
              <p className="text-xs text-slate-400">14:30</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-50 text-emerald-600">
              <FiCheckCircle />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="font-semibold text-slate-900">قيد التحضير</p>
              <p className="text-xs text-slate-400">20 دقيقة</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-orange-50 text-orange-600">
              <FiClock />
            </span>
          </div>
          <div className="flex items-center justify-between">
            <div className="text-right">
              <p className="font-semibold text-slate-900">تم التقديم</p>
            </div>
            <span className="grid h-9 w-9 place-items-center rounded-full bg-slate-100 text-slate-500">
              <FiPackage />
            </span>
          </div>
        </div>

        <hr className="my-5 border-slate-200" />

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">المنتجات</p>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-700">
            <div className="text-right">
              <p className="font-semibold">2x برجر لحم</p>
              <p className="text-xs text-slate-400">ملاحظة: بدون بصل</p>
            </div>
            <span>90 ر.س</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <div className="text-right">
              <p className="font-semibold">1x بيتزا مارغريتا كبيرة</p>
            </div>
            <span>65 ر.س</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <div className="text-right">
              <p className="font-semibold">2x سلطة خضراء</p>
            </div>
            <span>50 ر.س</span>
          </div>
          <div className="flex items-center justify-between text-slate-700">
            <div className="text-right">
              <p className="font-semibold">3x عصير برتقال</p>
              <p className="text-xs text-slate-400">ملاحظة: طازج</p>
            </div>
            <span>45 ر.س</span>
          </div>
        </div>

        <hr className="my-5 border-slate-200" />

        <div className="text-right">
          <p className="text-sm font-semibold text-slate-900">ملخص الدفع</p>
        </div>
        <div className="mt-4 space-y-3 text-sm">
          <div className="flex items-center justify-between text-slate-700">
            <span>إجمالي الفاتورة</span>
            <span className="font-semibold">285 ر.س</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-600">
              غير مدفوع
            </span>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <button className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700">
            طباعة
          </button>
          <button className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white">
            تغيير الحالة
          </button>
        </div>
      </aside>
    </div>
  );
}
