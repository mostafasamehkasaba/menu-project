"use client";

import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Doughnut, Line } from "react-chartjs-2";
import {
  FiAlertCircle,
  FiCalendar,
  FiBell,
  FiShoppingBag,
  FiDollarSign,
  FiClipboard,
} from "react-icons/fi";

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  Filler
);

const statCards = [
  {
    title: "طلبات جديدة",
    value: "12",
    Icon: FiAlertCircle,
    tone: "bg-orange-50 text-orange-600",
  },
  {
    title: "إجمالي المبيعات اليوم",
    value: "7,500 ر.س",
    delta: "+8%",
    Icon: FiDollarSign,
    tone: "bg-emerald-50 text-emerald-600",
  },
  {
    title: "إجمالي الطلبات اليوم",
    value: "48",
    delta: "+12%",
    Icon: FiShoppingBag,
    tone: "bg-sky-50 text-sky-600",
  },
  {
    title: "المدفوع / المتبقي",
    value: "800 / 4,200",
    Icon: FiClipboard,
    tone: "bg-indigo-50 text-indigo-600",
  },
  {
    title: "حجوزات اليوم",
    value: "8",
    delta: "+2",
    Icon: FiCalendar,
    tone: "bg-purple-50 text-purple-600",
  },
  {
    title: "طلبات النداء",
    value: "5",
    Icon: FiBell,
    tone: "bg-rose-50 text-rose-600",
  },
];

const activities = [
  "طلب جديد #1245 - طاولة 5",
  "دفعة مستلمة 250 ر.س - طاولة 3",
  "طلب نادل - طاولة 7",
  "حجز جديد - 4 أشخاص 7 مساءً",
  "طلب #1244 تم تقديمه - طاولة 2",
  "دفعة جزئية 150 ر.س - طاولة 6",
  "طلب جديد #1243 - توصيل",
  "طلب نادل - طاولة 1 (تم التعامل)",
];

const activityTimes = [
  "منذ دقيقة",
  "منذ 3 دقائق",
  "منذ 5 دقائق",
  "منذ 10 دقائق",
  "منذ 12 دقيقة",
  "منذ 15 دقيقة",
  "منذ 18 دقيقة",
  "منذ 20 دقيقة",
];

const doughnutData = {
  labels: ["طلبات مكتملة", "قيد التحضير", "قيد التوصيل", "ملغي"],
  datasets: [
    {
      data: [55, 25, 12, 8],
      backgroundColor: ["#16a34a", "#3b82f6", "#f97316", "#ef4444"],
      borderWidth: 0,
    },
  ],
};

const doughnutOptions = {
  cutout: "62%",
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  maintainAspectRatio: false,
};

const lineData = {
  labels: [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ],
  datasets: [
    {
      data: [4200, 5100, 4600, 6100, 5600, 6900, 7600],
      borderColor: "#16a34a",
      backgroundColor: "rgba(22, 163, 74, 0.15)",
      fill: true,
      tension: 0.35,
      pointRadius: 4,
      pointBackgroundColor: "#16a34a",
    },
  ],
};

const lineOptions = {
  plugins: {
    legend: { display: false },
    tooltip: { enabled: true },
  },
  scales: {
    y: {
      ticks: { color: "#94a3b8", font: { size: 11 } },
      grid: { color: "rgba(148, 163, 184, 0.15)" },
    },
    x: {
      ticks: { color: "#94a3b8", font: { size: 11 } },
      grid: { display: false },
    },
  },
  maintainAspectRatio: false,
};

export default function DashboardPage() {
  return (
    <>
      <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statCards.map((card) => (
          <div
                key={card.title}
                className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm"
              >
                <div className="space-y-1">
                  <p className="text-sm text-slate-500">{card.title}</p>
                  <div className="flex items-center gap-2">
                    <span className="text-lg font-semibold text-slate-900">
                      {card.value}
                    </span>
                    {card.delta ? (
                      <span className="text-xs font-semibold text-emerald-600">
                        {card.delta}
                      </span>
                    ) : null}
                  </div>
                  {card.title === "المدفوع / المتبقي" ? (
                    <div className="mt-2 h-2 w-40 rounded-full bg-slate-100">
                      <div className="h-full w-1/4 rounded-full bg-indigo-500" />
                    </div>
                  ) : null}
                </div>
                <span
                  className={`grid h-11 w-11 place-items-center rounded-2xl ${card.tone}`}
                >
                  <card.Icon />
                </span>
              </div>
            ))}
          </section>

          <section className="grid gap-4 lg:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    الطلبات حسب الحالة
                  </p>
                  <p className="text-xs text-slate-400">
                    توزيع الطلبات الحالية
                  </p>
                </div>
                <button className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                  أسبوعي
                </button>
              </div>
              <div className="mt-6 flex flex-col items-center gap-6 sm:flex-row sm:items-center sm:justify-between">
                <div className="h-48 w-48">
                  <Doughnut data={doughnutData} options={doughnutOptions} />
                </div>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-600" />
                    طلبات مكتملة 55%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-blue-500" />
                    قيد التحضير 25%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-orange-500" />
                    قيد التوصيل 12%
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-500" />
                    ملغي 8%
                  </div>
                </div>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-semibold text-slate-900">
                    اتجاه المبيعات (7 أيام)
                  </p>
                  <p className="text-xs text-slate-400">مبيعات آخر أسبوع</p>
                </div>
                <button className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
                  أسبوعي
                </button>
              </div>

              <div className="mt-4 h-56 rounded-2xl bg-slate-50 p-4">
                <Line data={lineData} options={lineOptions} />
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-900">الأنشطة المباشرة</p>
                <p className="text-xs text-slate-400">آخر 10 أحداث في النظام</p>
              </div>
              <button className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">عرض الكل</button>
            </div>
            <div className="mt-4 space-y-3">
              {activities.map((activity, index) => (
                <div
                  key={activity}
                  className="flex items-center justify-between rounded-2xl bg-emerald-50/60 px-4 py-3 text-sm text-slate-700"
                >
                  <span className="text-right font-semibold text-slate-700">
                    {activity}
                  </span>
                  <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500">
                    {activityTimes[index]}
                  </span>
                </div>
              ))}
            </div>
          </section>
    </>
  );
}




