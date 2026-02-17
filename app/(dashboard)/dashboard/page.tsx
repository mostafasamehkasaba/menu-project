"use client";

import { useEffect, useMemo, useState } from "react";
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
import {
  fetchActivityFeed,
  fetchDashboardSummary,
  fetchOrderStatusChart,
  fetchSalesTrend,
  type ApiActivityFeedItem,
  type ApiDashboardSummary,
  type ApiOrderStatusChart,
  type ApiSalesTrendItem,
} from "../../services/admin-api";

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

const formatSar = (value?: string | null) => {
  if (!value) {
    return "0 ر.س";
  }
  const numeric = Number(value);
  if (Number.isNaN(numeric)) {
    return `${value} ر.س`;
  }
  return `${numeric.toLocaleString("ar-EG")} ر.س`;
};

const relativeTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "-";
  }
  const diff = Math.max(0, Date.now() - date.getTime());
  const minutes = Math.round(diff / 60000);
  if (minutes < 60) {
    return `منذ ${minutes} دقيقة`;
  }
  const hours = Math.round(minutes / 60);
  return `منذ ${hours} ساعة`;
};

export default function DashboardPage() {
  const [summary, setSummary] = useState<ApiDashboardSummary | null>(null);
  const [statusChart, setStatusChart] = useState<ApiOrderStatusChart | null>(null);
  const [salesTrend, setSalesTrend] = useState<ApiSalesTrendItem[]>([]);
  const [activities, setActivities] = useState<ApiActivityFeedItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoadError(null);
      const [summaryData, statusData, trendData, activityData] = await Promise.all([
        fetchDashboardSummary(),
        fetchOrderStatusChart(),
        fetchSalesTrend(),
        fetchActivityFeed(),
      ]);
      if (!summaryData) {
        setLoadError("تعذر تحميل ملخص لوحة التحكم. تأكد من الاتصال والتوكن.");
      }
      setSummary(summaryData);
      setStatusChart(statusData);
      setSalesTrend(trendData ?? []);
      setActivities(activityData ?? []);
    };
    load();
  }, []);

  const paidValue = summary?.paid_vs_unpaid?.paid ?? 0;
  const unpaidValue = summary?.paid_vs_unpaid?.unpaid ?? 0;
  const partialValue = summary?.paid_vs_unpaid?.partial ?? 0;

  const statCards = useMemo(() => {
    return [
      {
        title: "طلبات جديدة",
        value: String(summary?.new_orders_count ?? 0),
        Icon: FiAlertCircle,
        tone: "bg-orange-50 text-orange-600",
      },
      {
        title: "إجمالي المبيعات اليوم",
        value: formatSar(summary?.today_sales_total ?? "0"),
        delta: "اليوم",
        Icon: FiDollarSign,
        tone: "bg-emerald-50 text-emerald-600",
      },
      {
        title: "إجمالي الطلبات اليوم",
        value: String(summary?.today_orders_count ?? 0),
        delta: "اليوم",
        Icon: FiShoppingBag,
        tone: "bg-sky-50 text-sky-600",
      },
      {
        title: "المدفوع / المتبقي",
        value: `${paidValue} / ${unpaidValue}`,
        delta: partialValue ? `جزئي: ${partialValue}` : undefined,
        Icon: FiClipboard,
        tone: "bg-indigo-50 text-indigo-600",
      },
      {
        title: "حجوزات اليوم",
        value: String(summary?.today_reservations_count ?? 0),
        delta: "اليوم",
        Icon: FiCalendar,
        tone: "bg-purple-50 text-purple-600",
      },
      {
        title: "طلبات النداء",
        value: String(summary?.open_call_requests_count ?? 0),
        Icon: FiBell,
        tone: "bg-rose-50 text-rose-600",
      },
    ];
  }, [summary, paidValue, unpaidValue, partialValue]);

  const chartCounts = statusChart ?? {
    NEW: 0,
    PREPARING: 0,
    SERVED: 0,
    CANCELLED: 0,
  };

  const totalStatus =
    chartCounts.NEW + chartCounts.PREPARING + chartCounts.SERVED + chartCounts.CANCELLED;

  const percent = (value: number) =>
    totalStatus ? Math.round((value / totalStatus) * 100) : 0;

  const doughnutData = {
    labels: ["طلبات جديدة", "قيد التحضير", "تم التقديم", "ملغي"],
    datasets: [
      {
        data: [
          chartCounts.NEW,
          chartCounts.PREPARING,
          chartCounts.SERVED,
          chartCounts.CANCELLED,
        ],
        backgroundColor: ["#f97316", "#3b82f6", "#16a34a", "#ef4444"],
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
    labels: salesTrend.map((item) => item.date),
    datasets: [
      {
        data: salesTrend.map((item) => Number(item.total || 0)),
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

  return (
    <>
      {loadError ? (
        <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-600">
          {loadError}
        </div>
      ) : null}

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
              <p className="text-xs text-slate-400">توزيع الطلبات الحالية</p>
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
                <span className="h-2 w-2 rounded-full bg-orange-500" />
                طلبات جديدة {percent(chartCounts.NEW)}%
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-blue-500" />
                قيد التحضير {percent(chartCounts.PREPARING)}%
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-emerald-600" />
                تم التقديم {percent(chartCounts.SERVED)}%
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-red-500" />
                ملغي {percent(chartCounts.CANCELLED)}%
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
          <button className="rounded-full border border-slate-200 px-3 py-1 text-xs text-slate-500">
            عرض الكل
          </button>
        </div>
        <div className="mt-4 space-y-3">
          {activities.length === 0 ? (
            <div className="rounded-2xl bg-slate-50 px-4 py-3 text-sm text-slate-500">
              لا توجد أنشطة بعد.
            </div>
          ) : (
            activities.slice(0, 8).map((activity) => (
              <div
                key={`${activity.entity_type}-${activity.entity_id}-${activity.created_at}`}
                className="flex items-center justify-between rounded-2xl bg-emerald-50/60 px-4 py-3 text-sm text-slate-700"
              >
                <span className="text-right font-semibold text-slate-700">
                  {activity.message_ar}
                </span>
                <span className="rounded-full bg-white px-3 py-1 text-xs text-slate-500">
                  {relativeTime(activity.created_at)}
                </span>
              </div>
            ))
          )}
        </div>
      </section>
    </>
  );
}

