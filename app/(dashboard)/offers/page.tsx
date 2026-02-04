"use client";

import { useMemo, useRef, useState } from "react";
import {
  FiCalendar,
  FiChevronDown,
  FiCopy,
  FiEdit2,
  FiCheck,
  FiPercent,
  FiPlus,
  FiSearch,
  FiTag,
  FiTrendingUp,
  FiTrash2,
} from "react-icons/fi";

const defaultOfferImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80";

type OfferStatus = "active" | "scheduled" | "expired";

type Offer = {
  id: number;
  title: string;
  desc: string;
  discount: string;
  startDate: string;
  endDate: string;
  usageUsed: number;
  usageTotal?: number;
  status: OfferStatus;
  active: boolean;
  image: string;
};

const initialOffers: Offer[] = [
  {
    id: 1,
    title: "خصم 25% على الوجبات العائلية",
    desc: "احصل على خصم 25% على جميع الوجبات العائلية طوال نهاية الأسبوع",
    discount: "25%",
    startDate: "2026-02-01",
    endDate: "2026-02-28",
    usageUsed: 142,
    status: "active",
    active: true,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 2,
    title: "اشتر 1 واحصل على 1 مجانا - برجر",
    desc: "عرض خاص على جميع أنواع البرجر - اشتر واحد واحصل على الثاني مجانا",
    discount: "50%",
    startDate: "2026-02-03",
    endDate: "2026-02-10",
    usageUsed: 87,
    usageTotal: 200,
    status: "active",
    active: true,
    image:
      "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 3,
    title: "خصم 30 ريال على طلبات التوصيل",
    desc: "خصم فوري 30 ريال على طلبات التوصيل التي تزيد عن 150 ريال",
    discount: "30 ر.س",
    startDate: "2026-01-15",
    endDate: "2026-02-15",
    usageUsed: 213,
    usageTotal: 500,
    status: "active",
    active: true,
    image:
      "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80",
  },
  {
    id: 4,
    title: "عرض وجبة الإفطار الخاص",
    desc: "وجبة إفطار كاملة مع عصير طبيعي بسعر مخفض 45 ريال فقط",
    discount: "20%",
    startDate: "2026-02-05",
    endDate: "2026-03-05",
    usageUsed: 0,
    usageTotal: 100,
    status: "scheduled",
    active: false,
    image:
      "https://images.unsplash.com/photo-1504754524776-8f4f37790ca0?auto=format&fit=crop&w=300&q=80",
  },
];

const statusPills: Record<OfferStatus, { label: string; className: string }> = {
  active: { label: "نشط", className: "bg-emerald-50 text-emerald-600" },
  scheduled: { label: "مجدول", className: "bg-blue-50 text-blue-600" },
  expired: { label: "منتهي", className: "bg-slate-100 text-slate-500" },
};

export default function OffersPage() {
  const [offers, setOffers] = useState<Offer[]>(initialOffers);
  const [statusFilter, setStatusFilter] = useState<"all" | OfferStatus>("all");
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    title: string;
  } | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const copyTimeoutRef = useRef<number | null>(null);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    discount: "",
    startDate: "",
    endDate: "",
    usageUsed: "",
    usageTotal: "",
    status: "scheduled",
    active: "inactive",
    image: "",
  });

  const filteredOffers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return offers.filter((offer) => {
      const matchesQuery =
        !normalized ||
        offer.title.toLowerCase().includes(normalized) ||
        offer.desc.toLowerCase().includes(normalized);
      const matchesStatus =
        statusFilter === "all" ||
        (offer.active
          ? "active"
          : offer.status === "active"
            ? "expired"
            : offer.status) === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [offers, query, statusFilter]);

  const summaryCards = useMemo(() => {
    const total = offers.length;
    const activeCount = offers.filter((offer) => offer.active).length;
    const scheduledCount = offers.filter(
      (offer) => offer.status === "scheduled" && !offer.active
    ).length;
    const usageTotal = offers.reduce(
      (acc, offer) => acc + offer.usageUsed,
      0
    );

    return [
      {
        label: "إجمالي العروض",
        value: total.toString(),
        tone: "bg-emerald-50 text-emerald-600",
        icon: <FiTag />,
      },
      {
        label: "العروض النشطة",
        value: activeCount.toString(),
        tone: "bg-emerald-50 text-emerald-600",
        icon: <FiTrendingUp />,
      },
      {
        label: "إجمالي الاستخدام",
        value: usageTotal.toString(),
        tone: "bg-slate-100 text-slate-700",
        icon: <FiPercent />,
      },
      {
        label: "العروض المجدولة",
        value: scheduledCount.toString(),
        tone: "bg-blue-50 text-blue-600",
        icon: <FiCalendar />,
      },
    ];
  }, [offers]);

  const toggleActive = (id: number) => {
    setOffers((prev) =>
      prev.map((offer) =>
        offer.id === id ? { ...offer, active: !offer.active } : offer
      )
    );
  };

  const resetForm = () => {
    setForm({
      title: "",
      desc: "",
      discount: "",
      startDate: "",
      endDate: "",
      usageUsed: "",
      usageTotal: "",
      status: "scheduled",
      active: "inactive",
      image: "",
    });
  };

  const handleEdit = (offer: Offer) => {
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      desc: offer.desc,
      discount: offer.discount,
      startDate: offer.startDate,
      endDate: offer.endDate,
      usageUsed: String(offer.usageUsed),
      usageTotal: offer.usageTotal ? String(offer.usageTotal) : "",
      status: offer.status,
      active: offer.active ? "active" : "inactive",
      image: offer.image,
    });
    setShowForm(true);
  };

  const handleSave = () => {
    const title = form.title.trim();
    const desc = form.desc.trim();
    const discount = form.discount.trim();
    const startDate = form.startDate.trim();
    const endDate = form.endDate.trim();
    const usageUsed = Number(form.usageUsed || "0");
    const usageTotal = form.usageTotal ? Number(form.usageTotal) : undefined;

    if (!title || !discount || !startDate || !endDate) {
      return;
    }

    if (editingId !== null) {
      setOffers((prev) =>
        prev.map((offer) =>
          offer.id === editingId
            ? {
                ...offer,
                title,
                desc,
                discount,
                startDate,
                endDate,
                usageUsed: Number.isFinite(usageUsed) ? usageUsed : offer.usageUsed,
                usageTotal:
                  usageTotal && Number.isFinite(usageTotal)
                    ? usageTotal
                    : offer.usageTotal,
                status: form.status as OfferStatus,
                active: form.active === "active",
                image: form.image || offer.image,
              }
            : offer
        )
      );
    } else {
      const nextId = offers.length
        ? Math.max(...offers.map((offer) => offer.id)) + 1
        : 1;
      const nextOffer: Offer = {
        id: nextId,
        title,
        desc,
        discount,
        startDate,
        endDate,
        usageUsed: Number.isFinite(usageUsed) ? usageUsed : 0,
        usageTotal:
          usageTotal && Number.isFinite(usageTotal) ? usageTotal : undefined,
        status: form.status as OfferStatus,
        active: form.active === "active",
        image: form.image || defaultOfferImage,
      };
      setOffers((prev) => [nextOffer, ...prev]);
    }

    setEditingId(null);
    setShowForm(false);
    resetForm();
  };

  const handleCopy = async (offer: Offer) => {
    const text = offer.title;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement("textarea");
        textarea.value = text;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        document.body.appendChild(textarea);
        textarea.focus();
        textarea.select();
        document.execCommand("copy");
        document.body.removeChild(textarea);
      }
      setCopiedId(offer.id);
      if (copyTimeoutRef.current) {
        window.clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = window.setTimeout(() => {
        setCopiedId(null);
      }, 1200);
    } catch {
      // ignore copy errors silently for now
    }
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    setOffers((prev) =>
      prev.filter((offer) => offer.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">إدارة العروض</h1>
          <p className="text-sm text-slate-500">
            إدارة العروض الترويجية والخصومات الخاصة بالمطعم
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            resetForm();
            setShowForm((prev) => !prev);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          <FiPlus />
          إضافة عرض جديد
        </button>
      </header>

      {showForm ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-right text-sm text-slate-600 md:col-span-2">
              عنوان العرض
              <input
                type="text"
                value={form.title}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, title: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الخصم
              <input
                type="text"
                value={form.discount}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, discount: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600 md:col-span-3">
              وصف العرض
              <input
                type="text"
                value={form.desc}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, desc: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              تاريخ البداية
              <input
                type="date"
                value={form.startDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, startDate: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              تاريخ النهاية
              <input
                type="date"
                value={form.endDate}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, endDate: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الاستخدام
              <input
                type="number"
                value={form.usageUsed}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, usageUsed: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الحد الأقصى للاستخدام
              <input
                type="number"
                value={form.usageTotal}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, usageTotal: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الحالة
              <select
                value={form.status}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, status: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="active">{statusPills.active.label}</option>
                <option value="scheduled">{statusPills.scheduled.label}</option>
                <option value="expired">{statusPills.expired.label}</option>
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600">
              مفعل الآن
              <select
                value={form.active}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, active: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="active">نعم</option>
                <option value="inactive">لا</option>
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600 md:col-span-3">
              رابط الصورة
              <input
                type="text"
                value={form.image}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, image: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
          </div>

          <div className="mt-4 flex justify-end gap-3">
            <button
              type="button"
              onClick={() => {
                setShowForm(false);
                setEditingId(null);
                resetForm();
              }}
              className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
            >
              إلغاء
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {editingId !== null ? "حفظ التعديل" : "إضافة العرض"}
            </button>
          </div>
        </section>
      ) : null}

      {deleteTarget ? (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-md rounded-3xl bg-white p-6 shadow-xl">
            <div className="text-right">
              <h3 className="text-lg font-semibold text-slate-900">
                تأكيد الحذف
              </h3>
              <p className="mt-2 text-sm text-slate-500">
                هل تريد حذف العرض{" "}
                <span className="font-semibold text-slate-700">
                  {deleteTarget.title}
                </span>
                ؟
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600"
              >
                إلغاء
              </button>
              <button
                type="button"
                onClick={confirmDelete}
                className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-semibold text-white"
              >
                حذف العرض
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {summaryCards.map((card) => (
          <div
            key={card.label}
            className="flex items-center justify-between rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="text-right">
              <p className="text-sm text-slate-500">{card.label}</p>
              <p className="mt-2 text-xl font-semibold text-slate-900">
                {card.value}
              </p>
            </div>
            <span
              className={`grid h-11 w-11 place-items-center rounded-2xl ${card.tone}`}
            >
              {card.icon}
            </span>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3">
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(event) =>
              setStatusFilter(event.target.value as "all" | OfferStatus)
            }
            className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">{statusPills.active.label}</option>
            <option value="scheduled">{statusPills.scheduled.label}</option>
            <option value="expired">{statusPills.expired.label}</option>
          </select>
          <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
          <FiSearch />
          <input
            type="text"
            placeholder="ابحث عن عرض..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-56 bg-transparent text-right outline-none"
          />
        </div>
      </div>

      <section className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">قائمة العروض</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[90px_1.5fr_0.7fr_0.9fr_0.8fr_0.7fr_0.7fr_0.7fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
              <div className="text-center">الصورة</div>
              <div className="text-right">العنوان</div>
              <div className="text-center">الخصم</div>
              <div className="text-center">الفترة</div>
              <div className="text-center">الاستخدام</div>
              <div className="text-center">الحالة</div>
              <div className="text-center">مفعل</div>
              <div className="text-center">الإجراءات</div>
            </div>

            {filteredOffers.map((offer) => {
              const status: OfferStatus = offer.active
                ? "active"
                : offer.status === "active"
                  ? "expired"
                  : offer.status;
              const statusMeta = statusPills[status];
              return (
                <div
                  key={offer.id}
                  className="grid grid-cols-[90px_1.5fr_0.7fr_0.9fr_0.8fr_0.7fr_0.7fr_0.7fr] items-center border-b border-slate-100 px-5 py-4 text-sm text-slate-700 last:border-b-0"
                >
                  <div className="flex justify-center">
                    <img
                      src={offer.image}
                      alt={offer.title}
                      className="h-12 w-12 rounded-2xl object-cover shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
                      loading="lazy"
                    />
                  </div>

                  <div className="text-right">
                    <p className="font-semibold text-slate-900">{offer.title}</p>
                    <p className="mt-1 text-xs text-slate-400">{offer.desc}</p>
                  </div>

                  <div className="flex items-center justify-center gap-1 font-semibold text-emerald-600">
                    <FiPercent className="text-xs" />
                    <span>{offer.discount}</span>
                  </div>

                  <div className="text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">
                      {offer.startDate}
                    </p>
                    <p>{offer.endDate}</p>
                  </div>

                  <div className="text-center text-xs text-slate-500">
                    {offer.usageTotal ? (
                      <span>
                        {offer.usageUsed} / {offer.usageTotal}
                      </span>
                    ) : (
                      <span>{offer.usageUsed}</span>
                    )}
                  </div>

                  <div className="flex justify-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="flex justify-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(offer.id)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        offer.active ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                      aria-pressed={offer.active}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          offer.active ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2 text-slate-500">
                    <button
                      type="button"
                      onClick={() => handleEdit(offer)}
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200"
                    >
                      <FiEdit2 />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleCopy(offer)}
                      className={`grid h-9 w-9 place-items-center rounded-xl border transition ${
                        copiedId === offer.id
                          ? "border-emerald-200 text-emerald-600"
                          : "border-slate-200"
                      } ${copiedId === offer.id ? "scale-105 animate-pulse" : ""}`}
                    >
                      {copiedId === offer.id ? <FiCheck /> : <FiCopy />}
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ id: offer.id, title: offer.title })
                      }
                      className="grid h-9 w-9 place-items-center rounded-xl border border-slate-200 text-rose-500"
                    >
                      <FiTrash2 />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
