"use client";

import { useMemo, useState } from "react";
import { categories as menuCategories, menuItems } from "../../lib/menu-data";
import type { LocalizedText } from "../../lib/i18n";
import { getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";
import {
  FiBox,
  FiCheckCircle,
  FiChevronDown,
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTag,
  FiTrash2,
  FiAlertCircle,
} from "react-icons/fi";

type CategoryRow = {
  id: string;
  label: LocalizedText;
  icon: string;
  active: boolean;
};

const statusPills = {
  active: { label: "نشط", className: "bg-emerald-50 text-emerald-600" },
  inactive: { label: "غير نشط", className: "bg-slate-100 text-slate-500" },
};

export default function CategoriesPage() {
  const { lang } = useLanguage();
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "inactive">(
    "all"
  );
  const [query, setQuery] = useState("");
  const [categories, setCategories] = useState<CategoryRow[]>(
    () =>
      menuCategories
        .filter((category) => category.id !== "all")
        .map((category) => ({ ...category, active: true }))
  );
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",
    icon: "🏷️",
    active: "active",
  });

  const categoryCounts = useMemo(() => {
    const map = new Map<string, number>();
    menuItems.forEach((item) => {
      map.set(item.category, (map.get(item.category) ?? 0) + 1);
    });
    return map;
  }, []);

  const summaryCards = useMemo(() => {
    const total = categories.length;
    const activeCount = categories.filter((category) => category.active).length;
    const totalItems = menuItems.length;
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
  }, [categories, categoryCounts]);

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

  const toggleActive = (id: string) => {
    setCategories((prev) =>
      prev.map((category) =>
        category.id === id ? { ...category, active: !category.active } : category
      )
    );
  };

  const resetForm = () => {
    setForm({
      nameAr: "",
      nameEn: "",
      icon: "🏷️",
      active: "active",
    });
  };

  const buildCategoryId = (base: string) => {
    const normalized = base
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-")
      .replace(/[^a-z0-9-]/g, "")
      .replace(/-+/g, "-")
      .replace(/^-+|-+$/g, "");
    const baseId = normalized || `cat-${Date.now()}`;
    let nextId = baseId;
    let counter = 1;
    while (categories.some((category) => category.id === nextId)) {
      nextId = `${baseId}-${counter}`;
      counter += 1;
    }
    return nextId;
  };

  const handleAddCategory = () => {
    const nameAr = form.nameAr.trim();
    if (!nameAr) {
      return;
    }
    const nameEn = form.nameEn.trim() || nameAr;
    const icon = form.icon.trim() || "🏷️";
    const id = buildCategoryId(nameEn);

    const nextCategory: CategoryRow = {
      id,
      label: { ar: nameAr, en: nameEn },
      icon,
      active: form.active === "active",
    };

    if (editingId !== null) {
      setCategories((prev) =>
        prev.map((category) =>
          category.id === editingId
            ? {
                ...category,
                label: { ar: nameAr, en: nameEn },
                icon,
                active: form.active === "active",
              }
            : category
        )
      );
    } else {
      setCategories((prev) => [nextCategory, ...prev]);
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
      icon: category.icon,
      active: category.active ? "active" : "inactive",
    });
    setShowForm(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    setCategories((prev) =>
      prev.filter((category) => category.id !== deleteTarget.id)
    );
    setDeleteTarget(null);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div className="text-right">
          <h1 className="text-lg font-semibold text-slate-900">
            إدارة التصنيفات
          </h1>
          <p className="text-sm text-slate-500">
            تنظيم تصنيفات القائمة وتحديد حالة كل تصنيف
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm((prev) => !prev);
          }}
          className="flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:-translate-y-0.5"
        >
          <FiPlus />
          إضافة تصنيف
        </button>
      </header>

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
              الأيقونة
              <input
                type="text"
                value={form.icon}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, icon: event.target.value }))
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
              onClick={handleAddCategory}
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
              <div className="text-center">مفعل</div>
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
                      onClick={() => toggleActive(category.id)}
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
