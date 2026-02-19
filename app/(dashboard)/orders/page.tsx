"use client";

import { useEffect, useMemo, useState } from "react";
import {
  FiClock,
  FiMapPin,
  FiSearch,
} from "react-icons/fi";
import { fetchOrders, setOrderStatus, type ApiOrderRead } from "../../services/admin-api";

type OrderStatusKey = "all" | ApiOrderRead["status"];

type StatusMeta = {
  label: string;
  className: string;
};

const statusPills: Record<ApiOrderRead["status"], StatusMeta> = {
  NEW: { label: "جديد", className: "bg-blue-50 text-blue-600" },
  PREPARING: { label: "قيد التحضير", className: "bg-orange-50 text-orange-600" },
  SERVED: { label: "تم التقديم", className: "bg-emerald-50 text-emerald-600" },
  CANCELLED: { label: "ملغي", className: "bg-slate-100 text-slate-500" },
};

const paymentPills: Record<ApiOrderRead["payment_status"], StatusMeta> = {
  PAID: { label: "مدفوع", className: "bg-emerald-50 text-emerald-600" },
  PARTIAL: { label: "مدفوع جزئي", className: "bg-amber-50 text-amber-600" },
  UNPAID: { label: "غير مدفوع", className: "bg-rose-50 text-rose-600" },
};

const orderTypeLabels: Record<ApiOrderRead["order_type"], string> = {
  DINE_IN: "في المطعم",
  TAKEAWAY: "سفري",
  DELIVERY: "توصيل",
};

const nextStatusMap: Partial<
  Record<ApiOrderRead["status"], ApiOrderRead["status"]>
> = {
  NEW: "PREPARING",
  PREPARING: "SERVED",
};

const formatTime = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleTimeString("ar-EG", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const formatDate = (value?: string | null) => {
  if (!value) {
    return "-";
  }
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toLocaleDateString("ar-EG");
};

const minutesAgo = (value?: string | null) => {
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
    return `${minutes} دقيقة`;
  }
  const hours = Math.round(minutes / 60);
  return `${hours} ساعة`;
};

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

export default function OrdersPage() {
  const [orders, setOrders] = useState<ApiOrderRead[]>([]);
  const [activeTab, setActiveTab] = useState<OrderStatusKey>("all");
  const [search, setSearch] = useState("");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailVisible, setDetailVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setLoadError(null);
      const data = await fetchOrders();
      if (!data) {
        setLoadError("تعذر تحميل الطلبات من الباك. تأكد من الاتصال والتوكن.");
        setOrders([]);
        setSelectedId(null);
        setIsLoading(false);
        return;
      }
      setOrders(data);
      setSelectedId(data[0]?.id ?? null);
      setIsLoading(false);
    };
    load();
  }, []);

  const statusCounts = useMemo(() => {
    return orders.reduce(
      (acc, order) => {
        acc[order.status] += 1;
        return acc;
      },
      { NEW: 0, PREPARING: 0, SERVED: 0, CANCELLED: 0 }
    );
  }, [orders]);

  const tabs = useMemo(
    () => [
      { key: "all" as const, label: "الكل", count: orders.length },
      { key: "NEW" as const, label: "جديد", count: statusCounts.NEW },
      { key: "PREPARING" as const, label: "قيد التحضير", count: statusCounts.PREPARING },
      { key: "SERVED" as const, label: "تم التقديم", count: statusCounts.SERVED },
      { key: "CANCELLED" as const, label: "ملغي", count: statusCounts.CANCELLED },
    ],
    [orders.length, statusCounts]
  );

  const filtered = useMemo(() => {
    const trimmed = search.trim();
    return orders.filter((order) => {
      const matchesStatus =
        activeTab === "all" || order.status === activeTab;
      if (!matchesStatus) {
        return false;
      }
      if (!trimmed) {
        return true;
      }
      const searchLower = trimmed.toLowerCase();
      return (
        String(order.id).includes(searchLower) ||
        (order.table ? String(order.table).includes(searchLower) : false)
      );
    });
  }, [orders, activeTab, search]);

  const itemsPerPage = 5;
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
  const safePage = Math.min(currentPage, totalPages);
  const pageStart = (safePage - 1) * itemsPerPage;
  const pagedOrders = filtered.slice(pageStart, pageStart + itemsPerPage);

  const selectedOrder = useMemo(() => {
    if (!selectedId) {
      return filtered[0] ?? null;
    }
    return orders.find((order) => order.id === selectedId) ?? null;
  }, [orders, filtered, selectedId]);

  useEffect(() => {
    if (!detailsOpen || !selectedOrder) {
      setDetailVisible(false);
      return;
    }
    setDetailVisible(false);
    const timer = window.setTimeout(() => setDetailVisible(true), 10);
    return () => window.clearTimeout(timer);
  }, [detailsOpen, selectedOrder?.id]);

  useEffect(() => {
    setCurrentPage(1);
    setDetailsOpen(false);
  }, [activeTab, search]);

  useEffect(() => {
    if (currentPage !== safePage) {
      setCurrentPage(safePage);
    }
  }, [currentPage, safePage]);

  const handleStatusChange = async () => {
    if (!selectedOrder) {
      return;
    }
    const next = nextStatusMap[selectedOrder.status];
    if (!next) {
      return;
    }
    setActionError(null);
    try {
      const updated = await setOrderStatus(selectedOrder.id, next);
      setOrders((prev) =>
        prev.map((order) => (order.id === updated.id ? updated : order))
      );
      setSelectedId(updated.id);
    } catch (error) {
      const message =
        (error as { message?: string })?.message ??
        "تعذر تحديث حالة الطلب.";
      setActionError(message);
    }
  };

  const handlePrint = () => {
    if (!selectedOrder) {
      setActionError("اختر طلبًا للطباعة أولًا.");
      return;
    }

    const status =
      statusPills[selectedOrder.status] ?? {
        label: selectedOrder.status ?? "غير معروف",
        className: "",
      };
    const payment =
      paymentPills[selectedOrder.payment_status] ?? {
        label: selectedOrder.payment_status ?? "غير معروف",
        className: "",
      };
    const itemsHtml = selectedOrder.items?.length
      ? selectedOrder.items
          .map(
            (item) => `
              <tr>
                <td style="padding:8px 0;">${item.qty}x ${item.product_name}</td>
                <td style="padding:8px 0; text-align:left;">${formatSar(
                  item.line_total
                )}</td>
              </tr>
            `
          )
          .join("")
      : `<tr><td colspan="2" style="padding:8px 0;">لا توجد منتجات.</td></tr>`;

    const win = window.open("", "_blank", "width=720,height=900");
    if (!win) {
      setActionError("تعذر فتح نافذة الطباعة.");
      return;
    }

    win.document.write(`
      <!DOCTYPE html>
      <html lang="ar" dir="rtl">
      <head>
        <meta charset="utf-8" />
        <title>طباعة الطلب</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 24px; color: #0f172a; }
          h1 { margin: 0 0 8px; font-size: 20px; }
          .meta { font-size: 12px; color: #475569; margin-bottom: 16px; }
          .card { border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; }
          .row { display: flex; justify-content: space-between; margin: 6px 0; }
          table { width: 100%; border-collapse: collapse; margin-top: 12px; }
          th { text-align: right; font-size: 12px; color: #64748b; padding-bottom: 6px; }
          td { font-size: 13px; border-bottom: 1px solid #e2e8f0; }
          .badge { display: inline-block; padding: 4px 10px; border-radius: 999px; background: #f1f5f9; font-size: 12px; }
        </style>
      </head>
      <body>
        <h1>طلب #${selectedOrder.id}</h1>
        <div class="meta">
          التاريخ: ${formatDate(selectedOrder.created_at)} • الوقت: ${formatTime(
      selectedOrder.created_at
    )}
        </div>
        <div class="card">
          <div class="row"><span>الحالة</span><span class="badge">${status.label}</span></div>
          <div class="row"><span>الدفع</span><span class="badge">${payment.label}</span></div>
          <div class="row"><span>النوع</span><span>${
            selectedOrder.table
              ? "في المطعم"
              : orderTypeLabels[selectedOrder.order_type]
          }</span></div>
          <div class="row"><span>الطاولة</span><span>${selectedOrder.table ?? "-"}</span></div>
          <div class="row"><span>الإجمالي</span><span>${formatSar(
            selectedOrder.total ?? selectedOrder.subtotal
          )}</span></div>
        </div>

        <table>
          <thead>
            <tr>
              <th>المنتج</th>
              <th style="text-align:left;">الإجمالي</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
      </body>
      </html>
    `);
    win.document.close();
    win.focus();
    win.onafterprint = () => win.close();
    win.print();
  };

  const detailsMotionClass = detailVisible
    ? "translate-x-0 opacity-100"
    : "-translate-x-6 opacity-0";

  return (
    <div
      className={`relative space-y-4 transition-all duration-300 lg:h-[calc(100vh-190px)] ${
        detailsOpen ? "lg:pl-[360px]" : "lg:pl-0"
      }`}
    >
      <aside
        className={`${
          detailsOpen ? "block" : "hidden"
        } lg:absolute lg:inset-y-0 lg:left-0 lg:w-[340px] lg:z-30`}
      >
        <div
          className={`flex h-full flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-sm transition-all duration-300 ease-out ${
            detailsOpen
              ? "translate-x-0 opacity-100"
              : "-translate-x-full opacity-0 pointer-events-none"
          }`}
        >
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-slate-900">تفاصيل الطلب</p>
            {selectedOrder ? (
              <span className="text-xs text-slate-400">
                #{selectedOrder.id}
              </span>
            ) : null}
          </div>

          {!selectedOrder ? (
            <div className="mt-5 text-right text-sm text-slate-500">
              اختر طلبًا لعرض التفاصيل.
            </div>
          ) : (
            <>
              <div
                className={`mt-4 space-y-3 transition-all duration-300 ease-out ${detailsMotionClass}`}
              >
                <div className="rounded-2xl bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <div className="text-right">
                      <p className="text-xs text-slate-400">الطلب</p>
                      <p className="text-lg font-semibold text-slate-900">
                        #{selectedOrder.id}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="text-xs text-slate-400">الإجمالي</p>
                      <p className="text-lg font-semibold text-emerald-600">
                        {formatSar(selectedOrder.total ?? selectedOrder.subtotal)}
                      </p>
                    </div>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {(() => {
                      const status = statusPills[selectedOrder.status] ?? {
                        label: selectedOrder.status ?? "غير معروف",
                        className: "bg-slate-100 text-slate-500",
                      };
                      return (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${status.className}`}
                        >
                          {status.label}
                        </span>
                      );
                    })()}
                    {(() => {
                      const payment = paymentPills[selectedOrder.payment_status] ?? {
                        label: selectedOrder.payment_status ?? "غير معروف",
                        className: "bg-slate-100 text-slate-500",
                      };
                      return (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.className}`}
                        >
                          {payment.label}
                        </span>
                      );
                    })()}
                    <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
                      {selectedOrder.table
                        ? "في المطعم"
                        : orderTypeLabels[selectedOrder.order_type]}
                    </span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div className="rounded-2xl border border-slate-200 px-3 py-2 text-right">
                    <p className="text-[11px] text-slate-400">الوقت</p>
                    <p className="font-semibold text-slate-900">
                      {formatTime(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 px-3 py-2 text-right">
                    <p className="text-[11px] text-slate-400">التاريخ</p>
                    <p className="font-semibold text-slate-900">
                      {formatDate(selectedOrder.created_at)}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 px-3 py-2 text-right">
                    <p className="text-[11px] text-slate-400">الطاولة</p>
                    <p className="font-semibold text-slate-900">
                      {selectedOrder.table ?? "-"}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-slate-200 px-3 py-2 text-right">
                    <p className="text-[11px] text-slate-400">منذ</p>
                    <p className="font-semibold text-slate-900">
                      {minutesAgo(selectedOrder.created_at)}
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-semibold text-slate-900">المنتجات</p>
                  <div className="mt-3 space-y-2 text-sm">
                    {selectedOrder.items?.length ? (
                      selectedOrder.items.slice(0, 4).map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center justify-between rounded-2xl border border-slate-200 px-3 py-2 text-slate-700"
                        >
                          <div className="text-right">
                            <p className="font-semibold">
                              {item.qty}x {item.product_name}
                            </p>
                            {item.notes ? (
                              <p className="text-[11px] text-slate-400">
                                {item.notes}
                              </p>
                            ) : null}
                          </div>
                          <span className="text-xs font-semibold">
                            {formatSar(item.line_total)}
                          </span>
                        </div>
                      ))
                    ) : (
                      <div className="text-right text-xs text-slate-400">
                        لا توجد منتجات.
                      </div>
                    )}
                    {selectedOrder.items &&
                    selectedOrder.items.length > 4 ? (
                      <div className="text-right text-xs text-slate-400">
                        +{selectedOrder.items.length - 4} عناصر أخرى
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-2xl border border-slate-200 px-3 py-3 text-sm">
                  <div className="flex items-center justify-between text-slate-700">
                    <span>إجمالي الفاتورة</span>
                    <span className="font-semibold">
                      {formatSar(selectedOrder.total ?? selectedOrder.subtotal)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between">
                    <span className="text-slate-500">حالة الدفع</span>
                    {(() => {
                      const payment =
                        paymentPills[selectedOrder.payment_status] ?? {
                          label: selectedOrder.payment_status ?? "غير معروف",
                          className: "bg-slate-100 text-slate-500",
                        };
                      return (
                        <span
                          className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.className}`}
                        >
                          {payment.label}
                        </span>
                      );
                    })()}
                  </div>
                </div>

                {actionError ? (
                  <div className="rounded-xl border border-rose-100 bg-rose-50 px-3 py-2 text-xs text-rose-600">
                    {actionError}
                  </div>
                ) : null}
              </div>

              <div className="mt-3 space-y-2">
                <button
                  type="button"
                  onClick={handlePrint}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700"
                >
                  طباعة
                </button>
                <button
                  type="button"
                  onClick={handleStatusChange}
                  className="w-full rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
                >
                  تغيير الحالة
                </button>
                <button
                  type="button"
                  onClick={() => setDetailsOpen(false)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
                >
                  إغلاق التفاصيل
                </button>
              </div>
            </>
          )}
        </div>
      </aside>

      <section className="lg:h-full">
        <div className="flex h-full flex-col space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 rounded-3xl bg-white px-4 py-3 shadow-sm">
            <div className="flex flex-wrap items-center gap-2">
              {tabs.map((tab) => (
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
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="ابحث عن طلب..."
                className="w-44 bg-transparent text-right outline-none sm:w-56"
              />
            </div>
          </div>

        {loadError ? (
          <div className="rounded-2xl border border-rose-100 bg-rose-50 px-4 py-2 text-sm text-rose-600">
            {loadError}
          </div>
        ) : null}

        <div className="space-y-3">
          {isLoading ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-right text-sm text-slate-500">
              جاري تحميل الطلبات...
            </div>
          ) : null}
          {!isLoading && filtered.length === 0 ? (
            <div className="rounded-2xl border border-slate-200 bg-white p-4 text-right text-sm text-slate-500">
              لا توجد طلبات مطابقة.
            </div>
          ) : null}
          {pagedOrders.map((order) => {
            const status = statusPills[order.status] ?? {
              label: order.status ?? "غير معروف",
              className: "bg-slate-100 text-slate-500",
            };
            const payment = paymentPills[order.payment_status] ?? {
              label: order.payment_status ?? "غير معروف",
              className: "bg-slate-100 text-slate-500",
            };
            const total = formatSar(order.total ?? order.subtotal ?? "0");
            return (
              <div
                key={order.id}
                onClick={() => setSelectedId(order.id)}
                className={`w-full rounded-2xl border border-slate-200 bg-white p-3 text-right shadow-sm transition hover:border-emerald-400 ${
                  selectedOrder?.id === order.id ? "border-emerald-500" : ""
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
                        {formatTime(order.created_at)}
                      </span>
                      {order.table ? (
                        <span className="flex items-center gap-1">
                          <FiMapPin />
                          طاولة {order.table}
                        </span>
                      ) : (
                        <span className="flex items-center gap-1">
                          <FiMapPin />
                          {orderTypeLabels[order.order_type]}
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
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${payment.className}`}
                      >
                        {payment.label}
                      </span>
                      {order.payment_status === "PARTIAL" ? (
                        <span className="text-xs text-slate-500">مدفوع جزئي</span>
                      ) : null}
                    </div>
                  </div>

                  <div className="text-left">
                    <p className="text-sm font-semibold text-slate-900">{total}</p>
                    <p className="text-xs text-slate-400">
                      {minutesAgo(order.created_at)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex items-center justify-end">
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setSelectedId(order.id);
                      setDetailsOpen(true);
                    }}
                    className="rounded-full border border-slate-200 px-3 py-1 text-xs font-semibold text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
                  >
                    عرض التفاصيل
                  </button>
                </div>
              </div>
            );
          })}
        </div>
        {filtered.length > itemsPerPage ? (
          <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm">
            <button
              type="button"
              onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
              disabled={safePage <= 1}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                safePage <= 1
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              السابق
            </button>
            <span className="text-xs text-slate-500">
              صفحة {safePage} من {totalPages}
            </span>
            <button
              type="button"
              onClick={() =>
                setCurrentPage((prev) => Math.min(totalPages, prev + 1))
              }
              disabled={safePage >= totalPages}
              className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
                safePage >= totalPages
                  ? "cursor-not-allowed bg-slate-100 text-slate-400"
                  : "border border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600"
              }`}
            >
              التالي
            </button>
          </div>
        ) : null}
        </div>
      </section>
    </div>
  );
}


