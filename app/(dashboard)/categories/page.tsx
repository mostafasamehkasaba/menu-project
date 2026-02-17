"use client";

import { useEffect, useMemo, useState } from "react";
import type { LocalizedText } from "../../lib/i18n";
import { getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";
import {
  FiAlertCircle,
  FiBox,
  FiCheckCircle,
  FiChevronDown,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTag,
  FiTrash2,
} from "react-icons/fi";
import {
  createCategory,
  deleteCategory,
  fetchCategories,
  fetchProducts,
  toggleCategoryActive,
  updateCategory,
  type ApiCategory,
  type ApiProductRead,
} from "../../services/admin-api";

type CategoryRow = {
  id: string;
  label: LocalizedText;
  icon: string;
  active: boolean;
  slug: string;
};

const statusPills = {
  active: { label: "نشط", className: "bg-emerald-50 text-emerald-600" },
  inactive: { label: "غير نشط", className: "bg-slate-100 text-slate-500" },
};

const toLocalizedText = (
  arValue?: string | null,
  enValue?: string | null
): LocalizedText => ({
  ar: arValue?.trim() || "",
  en: enValue?.trim() || arValue?.trim() || "",
});

const pickCategoryIcon = (label: string) => {
  const key = label.toLowerCase();
  if (
    key.includes("appet") ||
    key.includes("starter") ||
    key.includes("مقبل")
  )
    return "??";
  if (
    key.includes("main") ||
    key.includes("grill") ||
    key.includes("meal") ||
    key.includes("رئيس") ||
    key.includes("مشوي")
  )
    return "???";
  if (
    key.includes("drink") ||
    key.includes("beverage") ||
    key.includes("مشروب") ||
    key.includes("عصير")
  )
    return "??";
  if (
    key.includes("dessert") ||
    key.includes("sweet") ||
    key.includes("حلويات") ||
    key.includes("حلو")
  )
    return "??";
  return "?";
};

const buildSlug = (value: string) => {
  const normalized = value
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || `cat-${Date.now()}`;
};

const mapApiCategory = (category: ApiCategory): CategoryRow => {
  const label = toLocalizedText(category.name_ar, category.name_en);
  const iconSource = category.name_en || category.name_ar || "";
  return {
    id: String(category.id),
    label,
    icon: pickCategoryIcon(iconSource),
    active: category.is_active ?? true,
    slug: category.slug ?? buildSlug(category.name_en || category.name_ar || ""),
  };
};

export default function CategoriesPage() {
  const { lang } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<
    "all" | "active" | "inactive"
  >("all");
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<CategoryRow[]>([]);
  const [productCategoryIds, setProductCategoryIds] = useState<string[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",
    active: "active",
  });

  const buildProductCategoryIds = (products: ApiProductRead[] | null) => {
    if (!products) {
      return [];
    }
    return products
      .map((product) => product.category?.id)
      .filter((id): id is number => Number.isFinite(id))
      .map((id) => String(id));
  };

  const refreshProductCounts = async () => {
    const products = await fetchProducts();
    if (products) {
      setProductCategoryIds(buildProductCategoryIds(products));
    }
  };

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoadError(null);
      const [categoriesResult, productsResult] = await Promise.allSettled([
        fetchCategories(),
        fetchProducts(),
      ]);

      if (!mounted) {
        return;
      }

      if (categoriesResult.status === "fulfilled" && categoriesResult.value) {
        setCategories(categoriesResult.value.map(mapApiCategory));
      } else {
        setLoadError("تعذر تحميل التصنيفات من الباك.");
        setCategories([]);
      }

      if (productsResult.status === "fulfilled" && productsResult.value) {
        setProductCategoryIds(buildProductCategoryIds(productsResult.value));
      } else {
        setProductCategoryIds([]);
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const onFocus = () => {
      refreshProductCounts();
    };
    const onVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        refreshProductCounts();
      }
    };

    window.addEventListener("focus", onFocus);
    document.addEventListener("visibilitychange", onVisibilityChange);
    return () => {
      window.removeEventListener("focus", onFocus);
      document.removeEventListener("visibilitychange", onVisibilityChange);
    };
  }, []);

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    productCategoryIds.forEach((categoryId) => {
      map.set(categoryId, (map.get(categoryId) ?? 0) + 1);
    });
    return map;
  }, [productCategoryIds]);

  const summaryCards = useMemo(() => {
    const total = categories.length;
    const activeCount = categories.filter((category) => category.active).length;
    const totalItems = productCategoryIds.length;
    const emptyCount = categories.filter(
      (category) => (categoryCounts.get(category.id) ?? 0) === 0
    ).length;

    return [
      {
        label: "إجمالي التصنيفات",
        value: total.toString(),
        tone: "bg-emerald-50 text-emerald-600",
        icon: <FiTag />,
      },
      {
        label: "التصنيفات النشطة",
        value: activeCount.toString(),
        tone: "bg-emerald-50 text-emerald-600",
        icon: <FiCheckCircle />,
      },
      {
        label: "إجمالي المنتجات",
        value: totalItems.toString(),
        tone: "bg-slate-100 text-slate-700",
        icon: <FiBox />,
      },
      {
        label: "تصنيفات بدون منتجات",
        value: emptyCount.toString(),
        tone: "bg-rose-50 text-rose-600",
        icon: <FiAlertCircle />,
      },
    ];
  }, [categories, categoryCounts, productCategoryIds]);

  const filteredCategories = useMemo(() => {
    const normalized = query.trim().toLowerCase();
    return categories.filter((category) => {
      const label = getLocalizedText(category.label, lang).toLowerCase();
      const matchesQuery =
        !normalized ||
        label.includes(normalized) ||
        category.id.toLowerCase().includes(normalized);
      const matchesStatus =
        statusFilter === "all" ||
        (statusFilter === "active" ? category.active : !category.active);
      return matchesQuery && matchesStatus;
    });
  }, [categories, lang, query, statusFilter]);

  const resetForm = () => {
    setForm({
      nameAr: "",
      nameEn: "",
      active: "active",
    });
  };

  const handleSaveCategory = async () => {
    setLoadError(null);
    const nameAr = form.nameAr.trim();
    if (!nameAr) {
      return;
    }
    const nameEn = form.nameEn.trim() || nameAr;
    const existing = editingId
      ? categories.find((category) => category.id === editingId)
      : undefined;
    const slug = existing?.slug || buildSlug(nameEn || nameAr);
    const payload = {
      name_ar: nameAr,
      name_en: nameEn,
      slug,
      is_active: form.active === "active",
    };

    if (editingId !== null) {
      const idNumber = Number(editingId);
      if (Number.isFinite(idNumber)) {
        try {
          const updated = await updateCategory(idNumber, payload);
          setCategories((prev) =>
            prev.map((category) =>
              category.id === editingId ? mapApiCategory(updated) : category
            )
          );
        } catch {
          setLoadError("فشل تحديث التصنيف من الباك.");
          return;
        }
      }
    } else {
      try {
        const created = await createCategory(payload);
        setCategories((prev) => [mapApiCategory(created), ...prev]);
      } catch {
        setLoadError("فشل إضافة التصنيف على الباك.");
        return;
      }
    }

    setShowForm(false);
    setEditingId(null);
    resetForm();
  };

  const handleEdit = (category: CategoryRow) => {
    setEditingId(category.id);
    setForm({
      nameAr: category.label.ar,
      nameEn: category.label.en,
      active: category.active ? "active" : "inactive",
    });
    setShowForm(true);
  };

  const handleToggleActive = async (id: string) => {
    const target = categories.find((category) => category.id === id);
    if (!target) {
      return;
    }
    const nextActive = !target.active;
    const idNumber = Number(id);

    if (Number.isFinite(idNumber)) {
      try {
        const updated = await toggleCategoryActive(idNumber, nextActive);
        setCategories((prev) =>
          prev.map((category) =>
            category.id === id ? mapApiCategory(updated) : category
          )
        );
      } catch {
        setLoadError("تعذر تحديث حالة التصنيف من الباك.");
      }
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }

    const idNumber = Number(deleteTarget.id);
    if (!Number.isFinite(idNumber)) {
      return;
    }

    try {
      await deleteCategory(idNumber);
      setCategories((prev) =>
        prev.filter((category) => category.id !== deleteTarget.id)
      );
      setDeleteTarget(null);
    } catch {
      setLoadError("فشل حذف التصنيف من الباك.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">إدارة التصنيفات</h1>
          <p className="text-sm text-slate-500">
            تنظيم تصنيفات القائمة وتحديد حالة كل تصنيف
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setEditingId(null);
            setLoadError(null);
            setShowForm((prev) => !prev);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          <FiPlus />
          إضافة تصنيف
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
            <label className="block text-right text-sm text-slate-600">
              اسم التصنيف (عربي)
              <input
                type="text"
                value={form.nameAr}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nameAr: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              اسم التصنيف (English)
              <input
                type="text"
                value={form.nameEn}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, nameEn: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              الحالة
              <select
                value={form.active}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, active: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="active">نشط</option>
                <option value="inactive">غير نشط</option>
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
              onClick={handleSaveCategory}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white"
            >
              {editingId !== null ? "حفظ التعديل" : "إضافة التصنيف"}
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
                هل تريد حذف التصنيف{" "}
                <span className="font-semibold text-slate-700">
                  {deleteTarget.name}
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
                حذف التصنيف
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
              setStatusFilter(event.target.value as "all" | "active" | "inactive")
            }
            className="appearance-none rounded-xl border border-slate-200 bg-white px-4 py-2 pl-9 text-sm font-semibold text-slate-700"
          >
            <option value="all">جميع الحالات</option>
            <option value="active">نشط</option>
            <option value="inactive">غير نشط</option>
          </select>
          <FiChevronDown className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        </div>

        <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500">
          <FiSearch />
          <input
            type="text"
            placeholder="ابحث عن تصنيف..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            className="w-56 bg-transparent text-right outline-none"
          />
        </div>
      </div>

      <section
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        dir="rtl"
      >
        <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <h2 className="text-sm font-semibold text-slate-900">قائمة التصنيفات</h2>
        </div>

        <div className="overflow-x-auto">
          <div className="min-w-[900px]">
            <div className="grid grid-cols-[minmax(0,1.4fr)_0.7fr_0.7fr_0.6fr_0.8fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
              <div className="text-right">التصنيف</div>
              <div className="text-center">المنتجات</div>
              <div className="text-center">الحالة</div>
              <div className="text-center">مفعّل</div>
              <div className="text-center">الإجراءات</div>
            </div>

            {filteredCategories.map((category) => {
              const label = getLocalizedText(category.label, lang);
              const itemsCount = categoryCounts.get(category.id) ?? 0;
              const status = category.active ? "active" : "inactive";
              const statusMeta = statusPills[status];

              return (
                <div
                  key={category.id}
                  className="grid grid-cols-[minmax(0,1.4fr)_0.7fr_0.7fr_0.6fr_0.8fr] items-center border-b border-slate-100 px-5 py-4 text-sm text-slate-700 last:border-b-0"
                >
                  <div className="flex items-center justify-start gap-3 text-right">
                    <span className="grid h-10 w-10 place-items-center rounded-2xl bg-emerald-50 text-emerald-700">
                      {category.icon}
                    </span>
                    <div>
                      <p className="font-semibold text-slate-900">{label}</p>
                      <p className="text-xs text-slate-400">#{category.id}</p>
                    </div>
                  </div>

                  <div className="text-center font-semibold text-slate-900">
                    {itemsCount}
                  </div>

                  <div className="flex justify-center">
                    <span
                      className={`rounded-full px-3 py-1 text-xs font-semibold ${statusMeta.className}`}
                    >
                      {statusMeta.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleToggleActive(category.id)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        category.active ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                      aria-pressed={category.active}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          category.active ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(category)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      <FiEdit2 />
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setDeleteTarget({ id: category.id, name: label })
                      }
                      className="grid h-10 w-10 place-items-center rounded-xl border border-slate-200 text-rose-500"
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

