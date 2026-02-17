"use client";

import { useEffect, useMemo, useState, type ChangeEvent } from "react";
import type { LocalizedText } from "../../lib/i18n";
import { formatCurrency, getLocalizedText } from "../../lib/i18n";
import { useLanguage } from "../../components/language-provider";
import {
  createProduct,
  deleteProduct,
  fetchCategories,
  fetchProducts,
  fetchTags,
  toggleProductAvailability,
  updateProduct,
  type ApiCategory,
  type ApiProductRead,
  type ApiTag,
} from "../../services/admin-api";
import { getApiBaseUrl } from "../../services/api-client";
import { FiEdit2, FiPlus, FiSearch, FiTrash2 } from "react-icons/fi";

const defaultProductImage = "/images/placeholder.jpg";

type CategoryOption = {
  id: string;
  label: LocalizedText;
  isActive?: boolean;
};

type TagOption = {
  id: string;
  label: LocalizedText;
  colorKey?: string | null;
  code?: string | null;
};

type ProductRow = {
  id: number;
  name: LocalizedText;
  desc: LocalizedText;
  price: number;
  categoryId: string;
  image: string;
  isAvailable: boolean;
  tags: TagOption[];
};

type ProductForm = {
  nameAr: string;
  nameEn: string;
  descAr: string;
  price: string;
  categoryId: string;
  tagId: string;
  image: string;
};


const toLocalizedText = (
  arValue?: string | null,
  enValue?: string | null
): LocalizedText => ({
  ar: arValue?.trim() || "",
  en: enValue?.trim() || arValue?.trim() || "",
});

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

const mapApiCategory = (category: ApiCategory): CategoryOption => ({
  id: String(category.id),
  label: toLocalizedText(category.name_ar, category.name_en),
  isActive: category.is_active ?? true,
});

const mapApiTag = (tag: ApiTag): TagOption => ({
  id: String(tag.id),
  label: toLocalizedText(tag.name_ar, tag.name_ar),
  colorKey: tag.color_key ?? null,
  code: tag.code,
});

const mapApiProduct = (product: ApiProductRead): ProductRow => ({
  id: product.id,
  name: toLocalizedText(product.name_ar, product.name_ar),
  desc: toLocalizedText(product.description_ar ?? "", product.description_ar),
  price: parseNumber(product.price),
  categoryId: product.category ? String(product.category.id) : "uncategorized",
  image: resolveImageUrl(product.image) || defaultProductImage,
  isAvailable: product.is_available ?? true,
  tags: product.tags ? product.tags.map(mapApiTag) : [],
});


const getTagTone = (colorKey?: string | null) => {
  const key = (colorKey || "").toLowerCase();
  if (key.includes("blue")) return "bg-blue-50 text-blue-600";
  if (key.includes("green") || key.includes("emerald"))
    return "bg-emerald-50 text-emerald-600";
  if (key.includes("orange")) return "bg-orange-50 text-orange-600";
  if (key.includes("yellow")) return "bg-yellow-50 text-yellow-700";
  if (key.includes("purple")) return "bg-purple-50 text-purple-600";
  if (key.includes("rose") || key.includes("red"))
    return "bg-rose-50 text-rose-600";
  return "bg-slate-100 text-slate-600";
};

export default function ProductsPage() {
  const { lang } = useLanguage();
  const [items, setItems] = useState<ProductRow[]>([]);
  const [categories, setCategories] = useState<CategoryOption[]>([]);
  const [tags, setTags] = useState<TagOption[]>([]);
  const [query, setQuery] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<{
    id: number;
    name: string;
  } | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [formError, setFormError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [fileInputKey, setFileInputKey] = useState(0);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const defaultCategoryId = categories[0]?.id ?? "";
  const [form, setForm] = useState<ProductForm>({
    nameAr: "",
    nameEn: "",
    descAr: "",
    price: "",
    categoryId: defaultCategoryId,
    tagId: "",
    image: "",
  });

  useEffect(() => {
    let mounted = true;

    const loadData = async () => {
      setLoadError(null);
      const [categoriesResult, tagsResult, productsResult] =
        await Promise.allSettled([
          fetchCategories(),
          fetchTags(),
          fetchProducts(),
        ]);

      if (!mounted) {
        return;
      }

      if (
        categoriesResult.status === "fulfilled" &&
        categoriesResult.value &&
        categoriesResult.value.length
      ) {
        const mapped = categoriesResult.value.map(mapApiCategory);
        setCategories(mapped);
      } else {
        setCategories([]);
        setLoadError("تعذر تحميل التصنيفات من الباك.");
      }

      if (tagsResult.status === "fulfilled" && tagsResult.value) {
        setTags(tagsResult.value.map(mapApiTag));
      } else {
        setTags([]);
      }

      if (productsResult.status === "fulfilled" && productsResult.value) {
        setItems(productsResult.value.map(mapApiProduct));
      } else {
        setItems([]);
        setLoadError("تعذر تحميل المنتجات من الباك.");
      }
    };

    loadData();
    return () => {
      mounted = false;
    };
  }, []);

  const resolvedCategoryId = useMemo(() => {
    if (!categories.length) {
      return "";
    }
    const exists = categories.some((category) => category.id === form.categoryId);
    return exists ? form.categoryId : categories[0]?.id ?? "";
  }, [categories, form.categoryId]);

  const categoryMap = useMemo(() => {
    const map = new Map<string, string>();
    categories.forEach((category) => {
      map.set(category.id, getLocalizedText(category.label, lang));
    });
    return map;
  }, [categories, lang]);

  const availableTags = tags;

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    if (!normalizedQuery) {
      return items;
    }

    return items.filter((item) => {
      const name = getLocalizedText(item.name, lang).toLowerCase();
      const categoryLabel = categoryMap.get(item.categoryId)?.toLowerCase() ?? "";
      return (
        name.includes(normalizedQuery) ||
        categoryLabel.includes(normalizedQuery)
      );
    });
  }, [query, lang, categoryMap, items]);

  const handleEdit = (item: ProductRow) => {
    setEditingId(item.id);
    setForm({
      nameAr: item.name.ar,
      nameEn: item.name.en,
      descAr: item.desc.ar,
      price: String(item.price),
      categoryId: item.categoryId,
      tagId: item.tags[0]?.id ?? "",
      image: item.image,
    });
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
    setFormError(null);
    setShowForm(true);
  };

  const resetForm = () => {
    setForm({
      nameAr: "",
      nameEn: "",
      descAr: "",
      price: "",
      categoryId: categories[0]?.id ?? "",
      tagId: "",
      image: "",
    });
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
    setFormError(null);
  };

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) {
      setImageFile(null);
      setForm((prev) => ({ ...prev, image: "" }));
      return;
    }
    if (!file.type.startsWith("image/")) {
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      setForm((prev) => ({ ...prev, image: result }));
    };
    reader.readAsDataURL(file);
    setImageFile(file);
  };

  const clearImage = () => {
    setForm((prev) => ({ ...prev, image: defaultProductImage }));
    setImageFile(null);
    setFileInputKey((prev) => prev + 1);
  };

  const handleSave = async () => {
    setFormError(null);
    const trimmedAr = form.nameAr.trim();
    const descAr = form.descAr.trim();
    const priceValue = form.price.trim();
    const numericCategoryId = Number(resolvedCategoryId);
    const hasNumericCategory = Number.isFinite(numericCategoryId) && numericCategoryId > 0;

    if (!trimmedAr || !priceValue) {
      return;
    }
    if (!hasNumericCategory) {
      setFormError("لا يمكن حفظ المنتج قبل تحميل تصنيفات الباك. تأكد من الاتصال والتوكن.");
      return;
    }

    const tagIdValue = form.tagId ? Number(form.tagId) : null;
    const existing = editingId !== null
      ? items.find((item) => item.id === editingId)
      : null;

    const payload = {
      name_ar: trimmedAr,
      description_ar: descAr || undefined,
      category: numericCategoryId,
      price: priceValue,
      is_available: existing?.isAvailable ?? true,
      tag_ids: tagIdValue ? [tagIdValue] : undefined,
    };

    if (editingId !== null) {
      try {
        const updated = await updateProduct(editingId, payload, imageFile);
        setItems((prev) =>
          prev.map((item) =>
            item.id === editingId ? mapApiProduct(updated) : item
          )
        );
      } catch {
        setFormError("فشل تحديث المنتج من الباك. تحقق من الاتصال والتوكن.");
        return;
      }
    } else {
      try {
        const created = await createProduct(payload, imageFile);
        setItems((prev) => [mapApiProduct(created), ...prev]);
      } catch {
        setFormError("فشل إضافة المنتج على الباك. تحقق من الاتصال والتوكن.");
        return;
      }
    }

    setEditingId(null);
    setShowForm(false);
    resetForm();
  };

  const handleToggleAvailable = async (id: number) => {
    const target = items.find((item) => item.id === id);
    if (!target) {
      return;
    }

    try {
      const updated = await toggleProductAvailability(id);
      setItems((prev) =>
        prev.map((item) => (item.id === id ? mapApiProduct(updated) : item))
      );
      return;
    } catch {
      setActionError("تعذر تحديث حالة التوفر من الباك.");
    }
  };

  const confirmDelete = async () => {
    if (!deleteTarget) {
      return;
    }
    setActionError(null);
    try {
      await deleteProduct(deleteTarget.id);
      setItems((prev) => prev.filter((item) => item.id !== deleteTarget.id));
      setDeleteTarget(null);
    } catch {
      setActionError("فشل حذف المنتج من الباك.");
    }
  };

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white/80 px-5 py-4 shadow-sm backdrop-blur">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="order-1 text-right lg:order-1">
            <p className="text-sm font-semibold text-slate-900">إدارة المنتجات</p>
            <p className="text-xs text-slate-400">{items.length} منتج</p>
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
                setActionError(null);
                setLoadError(null);
                setShowForm((prev) => !prev);
              }}
              className="flex items-center gap-2 rounded-2xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-[0_12px_24px_rgba(16,185,129,0.35)] transition hover:-translate-y-0.5"
            >
              <FiPlus />
              إضافة منتج
            </button>
          </div>
        </div>
        {loadError ? (
          <p className="mt-3 text-right text-xs font-semibold text-rose-600">
            {loadError}
          </p>
        ) : null}
        {actionError ? (
          <p className="mt-3 text-right text-xs font-semibold text-rose-600">
            {actionError}
          </p>
        ) : null}
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
            <label className="block text-right text-sm text-slate-600 md:col-span-3">
              وصف المنتج
              <input
                type="text"
                value={form.descAr}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, descAr: event.target.value }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              />
            </label>
            <label className="block text-right text-sm text-slate-600">
              التصنيف
              <select
                value={resolvedCategoryId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    categoryId: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {getLocalizedText(category.label, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600">
              العلامة
              <select
                value={form.tagId}
                onChange={(event) =>
                  setForm((prev) => ({
                    ...prev,
                    tagId: event.target.value,
                  }))
                }
                className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none"
              >
                <option value="">بدون</option>
                {availableTags.map((tag) => (
                  <option key={tag.id} value={tag.id}>
                    {getLocalizedText(tag.label, lang)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block text-right text-sm text-slate-600 md:col-span-3">
              صورة المنتج
              <div className="mt-2 flex flex-wrap items-center justify-end gap-3">
                <div className="flex h-16 w-16 items-center justify-center overflow-hidden rounded-2xl border border-slate-200 bg-slate-50">
                  {form.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={form.image}
                      alt="صورة المنتج"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <span className="text-[11px] text-slate-400">بدون صورة</span>
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
                  {form.image ? (
                    <button
                      type="button"
                      onClick={clearImage}
                      className="rounded-lg border border-slate-200 px-3 py-2 text-xs font-semibold text-slate-600"
                    >
                      استخدام الصورة الافتراضية
                    </button>
                  ) : null}
                </div>
              </div>
              <p className="mt-2 text-xs text-slate-400">
                ارفع صورة بصيغة PNG أو JPG، وسيتم استخدامها في المنتج.
              </p>
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
              <h3 className="text-lg font-semibold text-slate-900">تأكيد الحذف</h3>
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
              const name = getLocalizedText(item.name, lang);
              const categoryLabel =
                categoryMap.get(item.categoryId) ?? item.categoryId;
              const tag = item.tags[0];
              const tagLabel = tag ? getLocalizedText(tag.label, lang) : "";

              return (
                <div
                  key={item.id}
                  className="grid grid-cols-[minmax(0,1.6fr)_0.9fr_0.8fr_0.8fr_0.7fr_0.9fr] items-center border-b border-slate-100 px-5 py-4 text-sm text-slate-700 last:border-b-0"
                >
                  <div className="flex items-center justify-start gap-3 text-right">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
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
                    {tagLabel ? (
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-semibold ${getTagTone(
                          tag?.colorKey
                        )}`}
                      >
                        {tagLabel}
                      </span>
                    ) : (
                      <span className="text-xs text-slate-300">-</span>
                    )}
                  </div>

                  <div className="flex items-center justify-center">
                    <button
                      type="button"
                      onClick={() => handleToggleAvailable(item.id)}
                      className={`relative h-6 w-11 rounded-full transition ${
                        item.isAvailable ? "bg-emerald-500" : "bg-slate-200"
                      }`}
                      aria-pressed={item.isAvailable}
                    >
                      <span
                        className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition ${
                          item.isAvailable ? "left-5" : "left-0.5"
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

