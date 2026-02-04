"use client";

import { useMemo, useState } from "react";
import type { MenuItem } from "../../lib/menu-data";
import { categories, menuItems } from "../../lib/menu-data";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";
import {
  FiEdit2,
  FiPlus,
  FiSearch,
  FiTrash2,
} from "react-icons/fi";

const categoryOptions = categories.filter((category) => category.id !== "all");
const defaultCategoryId = categoryOptions[0]?.id ?? "apps";

export default function ProductsPage() {
  const { lang } = useLanguage();
  const [items, setItems] = useState<MenuItem[]>(menuItems);
  const [query, setQuery] = useState("");
  const [activeIds, setActiveIds] = useState<Set<number>>(
    () => new Set(menuItems.map((item) => item.id))
  );
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [form, setForm] = useState({
    nameAr: "",
    nameEn: "",
    price: "",
    category: defaultCategoryId,
    tag: "none",
    image: "",
  });

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
      return items;
    }

    return items.filter((item) => {
      const name = getLocalizedText(item.name, lang).toLowerCase();
      const categoryLabel = categoryMap.get(item.category)?.toLowerCase() ?? "";
      return (
        name.includes(normalizedQuery) ||
        categoryLabel.includes(normalizedQuery)
      );
    });
  }, [query, lang, categoryMap, items]);

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

  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setForm({
      nameAr: item.name.ar,
      nameEn: item.name.en,
      price: String(item.price),
      category: item.category,
      tag: item.tag ?? "none",
      image: item.image,
    });
    setShowForm(true);
  };

  const confirmDelete = () => {
    if (!deleteTarget) {
      return;
    }
    setItems((prev) => {
      const next = prev.filter((item) => item.id !== deleteTarget.id);
      return next.length === prev.length ? [...prev] : next;
    });
    setActiveIds((prev) => {
      const next = new Set(prev);
      next.delete(deleteTarget.id);
      return next;
    });
    setDeleteTarget(null);
  };

  const resetForm = () => {
    setForm({
      nameAr: "",
      nameEn: "",
      price: "",
      category: defaultCategoryId,
      tag: "none",
      image: "",
    });
  };

  const handleSave = () => {
    const trimmedAr = form.nameAr.trim();
    const trimmedEn = form.nameEn.trim();
    const priceValue = Number(form.price);
    if (!trimmedAr || !form.category || !Number.isFinite(priceValue)) {
      return;
    }

    const tagValue = form.tag === "none" ? undefined : (form.tag as "new" | "hot");

    if (editingId !== null) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? {
                ...item,
                name: { ar: trimmedAr, en: trimmedEn || trimmedAr },
                price: priceValue,
                category: form.category as MenuItem["category"],
                tag: tagValue,
                image: form.image || item.image,
              }
            : item
        )
      );
    } else {
      const nextId = items.length
        ? Math.max(...items.map((item) => item.id)) + 1
        : 1;
      const nextItem: MenuItem = {
        id: nextId,
        name: { ar: trimmedAr, en: trimmedEn || trimmedAr },
        desc: { ar: "", en: "" },
        price: priceValue,
        category: form.category as MenuItem["category"],
        image: form.image || "/images/placeholder.jpg",
        tag: tagValue,
      };
      setItems((prev) => [nextItem, ...prev]);
      setActiveIds((prev) => {
        const next = new Set(prev);
        next.add(nextId);
        return next;
      });
    }

    setEditingId(null);
    setShowForm(false);
    resetForm();
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="order-1 text-right lg:order-1">
            <p className="text-sm font-semibold text-slate-900">
              إدارة المنتجات
            </p>
            <p className="text-xs text-slate-400">
              {items.length} منتج
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
            <button
              type="button"
              onClick={() => {
                setEditingId(null);
                resetForm();
                setShowForm((prev) => !prev);
              }}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5"
            >
              <FiPlus />
              إضافة منتج
            </button>
          </div>
        </div>
      </header>

      {showForm ? (
        <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="grid gap-4 md:grid-cols-3">
            <label className="block text-right text-sm text-slate-600">
              اسم المنتج (عربي)
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
              اسم المنتج (English)
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
              السعر
              <input
                type="number"
                value={form.price}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, price: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              التصنيف
              <select
                value={form.category}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, category: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                {categoryOptions.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getLocalizedText(category.label, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600">
              العلامة
              <select
                value={form.tag}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, tag: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="none">بدون</option>
                <option value="new">جديد</option>
                <option value="hot">حار</option>
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600 md:col-span-2">
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
              {editingId !== null ? "حفظ التعديل" : "إضافة المنتج"}
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
                هل تريد حذف المنتج{" "}
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
                حذف المنتج
              </button>
            </div>
          </div>
        </div>
      ) : null}

      <section
        className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm"
        dir="rtl"
      >
        <div className="overflow-x-auto">
          <div className="min-w-[980px]">
            <div className="grid grid-cols-[minmax(0,1.6fr)_0.9fr_0.8fr_0.8fr_0.7fr_0.9fr] border-b border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-600">
              <div className="text-right">المنتج</div>
              <div className="text-right">التصنيف</div>
              <div className="text-right">السعر</div>
              <div className="text-right">العلامات</div>
              <div className="text-center">متاح</div>
              <div className="text-center">الإجراءات</div>
            </div>

            {filteredItems.map((item) => {
              const isActive = activeIds.has(item.id);
              const name = getLocalizedText(item.name, lang);
              const categoryLabel =
                categoryMap.get(item.category) ?? item.category;

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1.6fr)_0.9fr_0.8fr_0.8fr_0.7fr_0.9fr] items-center border-b border-slate-100 px-5 py-4 text-sm text-slate-700 last:border-b-0"
                >
                  <div className="flex items-center justify-start gap-3 text-right">
                    <img
                      src={item.image}
                      alt={name}
                      className="h-12 w-12 rounded-2xl object-cover shadow-[0_8px_18px_rgba(15,23,42,0.12)]"
                      loading="lazy"
                    />
                    <div className="flex items-center gap-2 whitespace-nowrap">
                      <p className="font-semibold text-slate-900">{name}</p>
                      <span className="text-xs text-slate-400">#{item.id}</span>
                    </div>
                  </div>

                  <div className="text-right text-sm text-slate-600">
                    <span className="rounded-full border border-slate-200 px-3 py-1 text-xs">
                      {categoryLabel}
                    </span>
                  </div>

                  <div className="text-right font-semibold text-slate-900">
                    {formatCurrency(item.price, lang)}
                  </div>

                  <div className="flex items-center justify-start gap-2 whitespace-nowrap">
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

                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => toggleActive(item.id)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        isActive ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                      aria-pressed={isActive}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          isActive ? "left-5" : "left-0.5"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-center gap-2">
                    <button
                      type="button"
                      onClick={() => handleEdit(item)}
                      className="flex items-center gap-2 rounded-xl border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      <FiEdit2 />
                      تعديل
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget({ id: item.id, name })}
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


