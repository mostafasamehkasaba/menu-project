"use client";

import { useEffect, useMemo, useRef, useState, type ChangeEvent } from "react";
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
import {
  createOffer,
  deleteOffer,
  fetchOffers,
  toggleOfferActive,
  updateOffer,
  type ApiOffer,
} from "../../services/admin-api";
import { getApiBaseUrl } from "../../services/api-client";

const defaultOfferImage =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=300&q=80";

type OfferStatus = "active" | "scheduled" | "expired";

type OfferRow = {
  id: number;
  title: string;
  desc: string;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: number;
  startAt: string;
  endAt: string;
  isActive: boolean;
  image: string;
};

const statusPills: Record<OfferStatus, { label: string; className: string }> = {
  active: { label: "نشط", className: "bg-emerald-50 text-emerald-600" },
  scheduled: { label: "مجدول", className: "bg-blue-50 text-blue-600" },
  expired: { label: "منتهي", className: "bg-slate-100 text-slate-500" },
};

const parseNumber = (value: string | number | null | undefined) => {
  const parsed = typeof value === "number" ? value : Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

const resolveImageUrl = (image?: string | null) => {
  if (!image) {
    return null;
  }
  if (/^https?:\/\//i.test(image)) {
    return image;
  }
  const apiBase = getApiBaseUrl();
  if (!apiBase) {
    return image;
  }
  const normalized = image.startsWith("/") ? image : `/${image}`;
  return `${apiBase}${normalized}`;
};

const mapApiOffer = (offer: ApiOffer): OfferRow => ({
  id: offer.id,
  title: offer.title_ar,
  desc: offer.description_ar ?? "",
  type: offer.type,
  value: parseNumber(offer.value),
  startAt: offer.start_at,
  endAt: offer.end_at,
  isActive: offer.is_active ?? true,
  image: resolveImageUrl(offer.image) || defaultOfferImage,
});

const toDateInputValue = (value?: string | null) => {
  if (!value) {
    return "";
  }
  const date = new Date(value);
  if (!Number.isFinite(date.getTime())) {
    return "";
  }
  return date.toISOString().slice(0, 10);
};

const toApiDateTime = (value: string) => {
  if (!value) {
    return "";
  }
  return `${value}T00:00:00Z`;
};

const getOfferStatus = (offer: OfferRow): OfferStatus => {
  if (offer.isActive) {
    return "active";
  }
  const end = new Date(offer.endAt);
  if (Number.isFinite(end.getTime()) && end.getTime() < Date.now()) {
    return "expired";
  }
  return "scheduled";
};

const formatOfferValue = (offer: OfferRow) => {
  if (offer.type === "PERCENT") {
    return `${offer.value}%`;
  }
  return `${offer.value} ر.س`;
};

export default function OffersPage() {
  const [offers, setOffers] = useState<OfferRow[]>([]);
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
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [baseImage, setBaseImage] = useState(defaultOfferImage);
  const [form, setForm] = useState({
    title: "",
    desc: "",
    type: "PERCENT",
    value: "",
    startDate: "",
    endDate: "",
    active: "inactive",
    image: defaultOfferImage,
  });

  useEffect(() => {
    let mounted = true;
    const loadOffers = async () => {
      setLoadError(null);
      const data = await fetchOffers();
      if (!mounted) {
        return;
      }
      if (data) {
        setOffers(data.map(mapApiOffer));
      } else {
        setOffers([]);
        setLoadError("تعذر تحميل العروض من الباك.");
      }
    };

    loadOffers();
    return () => {
      mounted = false;
    };
  }, []);

  const filteredOffers = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return offers.filter((offer) => {
      const matchesQuery =
        !normalized ||
        offer.title.toLowerCase().includes(normalized) ||
        offer.desc.toLowerCase().includes(normalized);
      const status = getOfferStatus(offer);
      const matchesStatus = statusFilter === "all" || status === statusFilter;
      return matchesQuery && matchesStatus;
    });
  }, [offers, query, statusFilter]);

  const summaryCards = useMemo(() => {
    const total = offers.length;
    const activeCount = offers.filter((offer) => offer.isActive).length;
    const scheduledCount = offers.filter(
      (offer) => getOfferStatus(offer) === "scheduled"
    ).length;
    const expiredCount = offers.filter(
      (offer) => getOfferStatus(offer) === "expired"
    ).length;

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
        label: "العروض المجدولة",
        value: scheduledCount.toString(),
        tone: "bg-blue-50 text-blue-600",
        icon: <FiCalendar />,
      },
      {
        label: "العروض المنتهية",
        value: expiredCount.toString(),
        tone: "bg-slate-100 text-slate-700",
        icon: <FiPercent />,
      },
    ];
  }, [offers]);

  const resetForm = () => {
    setForm({
      title: "",
      desc: "",
      type: "PERCENT",
      value: "",
      startDate: "",
      endDate: "",
      active: "inactive",
      image: defaultOfferImage,
    });
    setFormError(null);
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
    setBaseImage(defaultOfferImage);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setForm((prev) => ({ ...prev, image: baseImage }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({ ...prev, image: result || defaultOfferImage }));
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const clearImage = () => {
    setImageFile(null);
    setForm((prev) => ({ ...prev, image: baseImage }));
    setFileInputKey((prev) => prev + 1);
  };

  const handleEdit = (offer: OfferRow) => {
    const initialImage = offer.image || defaultOfferImage;
    setEditingId(offer.id);
    setForm({
      title: offer.title,
      desc: offer.desc,
      type: offer.type,
      value: String(offer.value),
      startDate: toDateInputValue(offer.startAt),
      endDate: toDateInputValue(offer.endAt),
      active: offer.isActive ? "active" : "inactive",
      image: initialImage,
    });
    setBaseImage(initialImage);
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
    setFormError(null);
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError(null);
    const title = form.title.trim();
    const desc = form.desc.trim();
    const value = form.value.trim();
    const startDate = form.startDate.trim();
    const endDate = form.endDate.trim();

    if (!title || !value || !startDate || !endDate) {
      setFormError("يرجى تعبئة الحقول المطلوبة.");
      return;
    }

    const payload = {
      title_ar: title,
      description_ar: desc || undefined,
      type: form.type as "PERCENT" | "FIXED_AMOUNT",
      value,
      start_at: toApiDateTime(startDate),
      end_at: toApiDateTime(endDate),
      is_active: form.active === "active",
    };

    if (editingId !== null) {
      try {
        const updated = await updateOffer(editingId, payload, imageFile);
        setOffers((prev) =>
          prev.map((offer) => (offer.id === editingId ? mapApiOffer(updated) : offer))
        );
      } catch {
        setFormError("فشل تحديث العرض من الباك.");
        return;
      }
    } else {
      try {
        const created = await createOffer(payload, imageFile);
        setOffers((prev) => [mapApiOffer(created), ...prev]);
      } catch {
        setFormError("فشل إضافة العرض على الباك.");
        return;
      }
    }

    setEditingId(null);
    setShowForm(false);
    resetForm();
  };

  const handleCopy = async (offer: OfferRow) => {
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

  const handleToggleActive = async (offer: OfferRow) => {
    try {
      const updated = await toggleOfferActive(offer.id, !offer.isActive);
      setOffers((prev) =>
        prev.map((item) => (item.id === offer.id ? mapApiOffer(updated) : item))
      );
    } catch {
      setLoadError("تعذر تحديث حالة العرض من الباك.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    try {
      await deleteOffer(deleteTarget.id);
      setOffers((prev) => prev.filter((offer) => offer.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setLoadError("فشل حذف العرض من الباك.");
    }
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
            setLoadError(null);
            setShowForm((prev) => !prev);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          <FiPlus />
          إضافة عرض جديد
        </button>
      </header>
      {loadError ? (
        <p className="text-right text-xs font-semibold text-rose-600">
          {loadError}
        </p>
      ) : null}

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
              نوع الخصم
              <select
                value={form.type}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, type: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="PERCENT">نسبة مئوية</option>
                <option value="FIXED_AMOUNT">قيمة ثابتة</option>
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600">
              القيمة
              <input
                type="number"
                value={form.value}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, value: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600 md:col-span-2">
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
            <label className="block text-right text-sm text-slate-600 md:col-span-3">
              صورة العرض
              <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {form.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.image}
                      alt="صورة العرض"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400">
                      بدون صورة
                    </span>
                  )}
                </div>
                <div className="flex flex-1 flex-wrap items-center justify-end gap-2">
                  <input
                    key={fileInputKey}
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="block w-full cursor-pointer rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-slate-700 hover:file:bg-slate-200"
                  />
                  {imageFile ? (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      إلغاء الصورة المختارة
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                ارفع صورة بصيغة PNG أو JPG، وسيتم استخدامها في العرض.
              </p>
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
              مفعّل الآن
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
          {formError ? (
            <p className="mt-3 text-right text-xs font-semibold text-rose-600">
              {formError}
            </p>
          ) : null}
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
          <div className="min-w-[940px]">
            <div className="grid grid-cols-[90px_1.6fr_0.8fr_0.9fr_0.7fr_0.7fr_0.7fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
              <div className="text-center">الصورة</div>
              <div className="text-right">العنوان</div>
              <div className="text-center">الخصم</div>
              <div className="text-center">الفترة</div>
              <div className="text-center">الحالة</div>
              <div className="text-center">مفعّل</div>
              <div className="text-center">الإجراءات</div>
            </div>

            {filteredOffers.map((offer) => {
              const status = getOfferStatus(offer);
              const statusMeta = statusPills[status];
              return (
                <div
                  key={offer.id}
                  className="grid grid-cols-[90px_1.6fr_0.8fr_0.9fr_0.7fr_0.7fr_0.7fr] items-center border-b border-slate-100 px-5 py-4 text-sm text-slate-700 last:border-b-0"
                >
                  <div className="flex justify-center">
                    <img
                      src={offer.image || defaultOfferImage}
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
                    <span>{formatOfferValue(offer)}</span>
                  </div>

                  <div className="text-center text-xs text-slate-500">
                    <p className="font-semibold text-slate-700">
                      {toDateInputValue(offer.startAt)}
                    </p>
                    <p>{toDateInputValue(offer.endAt)}</p>
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
                      onClick={() => handleToggleActive(offer)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        offer.isActive ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                      aria-pressed={offer.isActive}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          offer.isActive ? "left-5" : "left-0.5"
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

