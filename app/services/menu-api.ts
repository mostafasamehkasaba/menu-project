"use client";

import type { LocalizedText } from "../lib/i18n";
import type { MenuCategory, MenuExtra, MenuItem, OfferItem } from "../lib/menu-data";
import { apiFetch, getAccessToken, getApiBaseUrl } from "./api-client";

type Paginated<T> = {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
};

type Root<T> = {
  success: boolean;
  data: T;
  message: string;
};

type ApiCategory = {
  id: number;
  name_ar: string;
  name_en?: string | null;
  slug?: string | null;
  is_active?: boolean;
};

type ApiTag = {
  id: number;
  code: string;
  name_ar: string;
};

type ApiProduct = {
  id: number;
  name_ar: string;
  description_ar?: string | null;
  price: string;
  image?: string | null;
  image_url?: string | null;
  image_file?: string | null;
  photo?: string | null;
  thumbnail?: string | null;
  category?: ApiCategory | null;
  tags?: ApiTag[] | null;
  is_available?: boolean;
  extras?: ApiProductExtra[] | null;
};

type ApiProductExtra = {
  id?: number | string | null;
  name_ar?: string | null;
  name_en?: string | null;
  price?: string | number | null;
  label?: string | null;
};

type ApiOffer = {
  id: number;
  title_ar: string;
  description_ar?: string | null;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: string;
  is_active?: boolean;
  image?: string | null;
};

type ApiOrderItemCreate = {
  product: number;
  qty: number;
  notes?: string | null;
};

type ApiOrderCreate = {
  order_type: "DINE_IN" | "TAKEAWAY";
  table?: number | null;
  notes?: string | null;
  items: ApiOrderItemCreate[];
};

type ApiOrderCreated = {
  id: number;
  order_type?: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  table?: number | null;
  status?: string;
  payment_status?: string;
  created_at?: string | null;
};

type ApiCallRequestCreate = {
  table: number;
  type: "BILL_REQUEST" | "HELP" | "EXTRA_ORDER" | "PROBLEM";
};

type ApiCallRequest = {
  id: number;
  status?: "NEW" | "HANDLED" | "CANCELLED";
  created_at?: string | null;
};

type ApiTable = {
  id: number;
  number: number;
  table_number?: number | null;
  code?: string | null;
  capacity?: number | null;
  status?: "AVAILABLE" | "OCCUPIED" | "RESERVED";
};

type ApiReservationCreate = {
  customer_name: string;
  phone: string;
  start_at: string;
  party_size: number;
  table?: number | null;
  status?: "PENDING" | "CONFIRMED";
  notes?: string | null;
};

type ApiReservation = {
  id: number;
  start_at?: string | null;
  table?: number | null;
};

export type MenuCatalog = {
  categories: MenuCategory[];
  items: MenuItem[];
  offers: OfferItem[];
};

const DEFAULT_PRODUCT_IMAGE =
  "https://images.unsplash.com/photo-1504674900247-0877df9cc836?auto=format&fit=crop&w=1200&q=80";
const DEFAULT_OFFER_IMAGE =
  "https://images.unsplash.com/photo-1499636136210-6f4ee915583e?auto=format&fit=crop&w=1200&q=80";
const ALL_CATEGORY: MenuCategory = {
  id: "all",
  label: { ar: "الكل", en: "All" },
  icon: "✦",
};

const normalizePath = (value: unknown): string | null => {
  if (!value || typeof value !== "string") {
    return null;
  }
  if (value.startsWith("http://") || value.startsWith("https://")) {
    const parsed = new URL(value);
    return `${parsed.pathname}${parsed.search}`;
  }
  return value;
};

const unwrapRoot = <T>(payload: T | Root<T>): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as Root<T>).data;
  }
  return payload as T;
};

const unwrapPaginated = <T>(
  payload: Paginated<T> | Root<Paginated<T>> | T[] | Root<T[]>
): Paginated<T> => {
  const unwrapped = unwrapRoot(payload as Paginated<T> | T[]);
  if (Array.isArray(unwrapped)) {
    return {
      count: unwrapped.length,
      next: null,
      previous: null,
      results: unwrapped,
    };
  }
  return unwrapped as Paginated<T>;
};

type ApiFetchOptions = Parameters<typeof apiFetch>[1];

const fetchAllPages = async <T>(
  path: string,
  options?: ApiFetchOptions
): Promise<T[]> => {
  const results: T[] = [];
  let nextPath: string | null = path;
  let safety = 0;

  while (nextPath && safety < 50) {
    const payload = await apiFetch<
      Paginated<T> | Root<Paginated<T>> | T[] | Root<T[]>
    >(nextPath, options);
    const pageData = unwrapPaginated(payload);
    if (!pageData || !Array.isArray(pageData.results)) {
      break;
    }
    results.push(...pageData.results);
    nextPath = normalizePath(pageData.next);
    safety += 1;
  }

  return results;
};

const isAuthError = (status?: number | null) =>
  status === 401 || status === 403;

const fetchAllPagesSafe = async <T>(
  path: string,
  options?: ApiFetchOptions
) => {
  try {
    return { ok: true, data: await fetchAllPages<T>(path, options) };
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    return { ok: false, data: [] as T[], status };
  }
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

const pickCategoryIcon = (label: string) => {
  const key = label.toLowerCase();
  if (key.includes("appet") || key.includes("starter")) return "🥗";
  if (key.includes("main") || key.includes("grill") || key.includes("meal"))
    return "🍲";
  if (key.includes("drink") || key.includes("beverage")) return "🥤";
  if (key.includes("dessert") || key.includes("sweet")) return "🍰";
  return "✦";
};

const mapCategory = (category: ApiCategory): MenuCategory => {
  const label = category.slug || category.name_en || category.name_ar || "";
  return {
    id: String(category.id),
    label: toLocalizedText(category.name_ar, category.name_en),
    icon: pickCategoryIcon(label),
  };
};

const mapProduct = (product: ApiProduct): MenuItem => {
  const label = product.name_ar || "";
  const rawImage =
    product.image ||
    product.image_url ||
    product.image_file ||
    product.photo ||
    product.thumbnail ||
    null;
  const extras: MenuExtra[] = (product.extras ?? [])
    .map((extra, index) => ({
      id: String(extra.id ?? `extra-${index}`),
      label: toLocalizedText(extra.name_ar ?? extra.label ?? "", extra.name_en),
      price: parseNumber(extra.price ?? 0),
    }))
    .filter((extra) => extra.label.ar || extra.label.en);
  return {
    id: product.id,
    name: toLocalizedText(label, label),
    desc: toLocalizedText(product.description_ar ?? "", product.description_ar),
    price: parseNumber(product.price),
    category: product.category ? String(product.category.id) : "uncategorized",
    image: resolveImageUrl(rawImage) || DEFAULT_PRODUCT_IMAGE,
    extras: extras.length ? extras : undefined,
  };
};

const mapOffer = (offer: ApiOffer): OfferItem => {
  const badge =
    offer.type === "PERCENT"
      ? `${parseNumber(offer.value)}%`
      : `-${parseNumber(offer.value)}`;
  return {
    id: offer.id,
    title: toLocalizedText(offer.title_ar, offer.title_ar),
    desc: toLocalizedText(offer.description_ar ?? "", offer.description_ar),
    price: parseNumber(offer.value),
    badge,
    image: resolveImageUrl(offer.image) || DEFAULT_OFFER_IMAGE,
  };
};

const fetchOffers = async (hasToken: boolean): Promise<ApiOffer[]> => {
  const offersPath = hasToken
    ? "/api/offers/?page_size=200"
    : "/api/offers/?is_active=true&page_size=200";

  try {
    return await fetchAllPages<ApiOffer>(offersPath);
  } catch {
    try {
      const payload = await apiFetch<
        ApiOffer | Paginated<ApiOffer> | ApiOffer[] | Root<ApiOffer[]>
      >("/api/offers/active/");
      const unwrapped = unwrapRoot(
        payload as ApiOffer | Paginated<ApiOffer> | ApiOffer[]
      );
      if (Array.isArray((unwrapped as Paginated<ApiOffer>)?.results)) {
        return (unwrapped as Paginated<ApiOffer>).results;
      }
      if (Array.isArray(unwrapped)) {
        return unwrapped;
      }
      return unwrapped ? [unwrapped as ApiOffer] : [];
    } catch {
      return [];
    }
  }
};

export const fetchMenuCatalog = async (): Promise<MenuCatalog | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }

  const hasToken = Boolean(getAccessToken());
  const categoriesPath = hasToken
    ? "/api/categories/?page_size=200"
    : "/api/categories/?is_active=true&page_size=200";
  const productsPath = hasToken
    ? "/api/products/?page_size=200"
    : "/api/products/?is_available=true&page_size=200";
  const publicCategoriesPath = "/api/categories/?is_active=true&page_size=200";
  const publicProductsPath = "/api/products/?is_available=true&page_size=200";

  const [categoriesResult, productsResult, offersResult] = await Promise.all([
    fetchAllPagesSafe<ApiCategory>(categoriesPath),
    fetchAllPagesSafe<ApiProduct>(productsPath),
    fetchOffers(hasToken)
      .then((data) => ({ ok: true, data }))
      .catch(() => ({ ok: false, data: [] as ApiOffer[] })),
  ]);

  if (
    hasToken &&
    (isAuthError(categoriesResult.status) || isAuthError(productsResult.status))
  ) {
    const [fallbackCategories, fallbackProducts] = await Promise.all([
      fetchAllPagesSafe<ApiCategory>(publicCategoriesPath, {
        skipAuth: true,
        skipRefresh: true,
      }),
      fetchAllPagesSafe<ApiProduct>(publicProductsPath, {
        skipAuth: true,
        skipRefresh: true,
      }),
    ]);
    if (!categoriesResult.ok && fallbackCategories.ok) {
      categoriesResult.data = fallbackCategories.data;
    }
    if (!productsResult.ok && fallbackProducts.ok) {
      productsResult.data = fallbackProducts.data;
    }
  }

  if (!categoriesResult.ok && !productsResult.ok) {
    return null;
  }

  const products = productsResult.ok ? productsResult.data : [];

  const categories =
    categoriesResult.ok
      ? categoriesResult.data.map(mapCategory)
      : Array.from(
          new Map(
            products
              .map((product) => product.category)
              .filter(
                (category): category is ApiCategory =>
                  Boolean(category?.id)
              )
              .map((category) => [category.id, category])
          ).values()
        ).map(mapCategory);

  const items = products.map(mapProduct);

  const offers: OfferItem[] = [];
  if (offersResult.ok) {
    offers.push(...offersResult.data.map(mapOffer));
  }

  return {
    categories: [ALL_CATEGORY, ...categories],
    items,
    offers,
  };
};

export const createMenuOrder = async (
  payload: ApiOrderCreate
): Promise<ApiOrderCreated> => {
  const baseItems = payload.items.map((item) => ({
    product: item.product,
    qty: item.qty,
    notes: item.notes ?? undefined,
  }));
  const altItems = payload.items.map((item) => ({
    product_id: item.product,
    quantity: item.qty,
    notes: item.notes ?? undefined,
  }));
  const productItems = payload.items.map((item) => ({
    id: item.product,
    qty: item.qty,
    notes: item.notes ?? undefined,
  }));

  const basePayload = {
    order_type: payload.order_type,
    notes: payload.notes ?? undefined,
  };
  const typePayload = {
    type: payload.order_type,
    notes: payload.notes ?? undefined,
  };

  const tableFields = payload.table ? ["table", "table_id", "table_number"] : [null];
  const itemVariants: Array<{ key: "items" | "line_items" | "products"; value: unknown }> = [
    { key: "items", value: baseItems },
    { key: "items", value: altItems },
    { key: "line_items", value: baseItems },
    { key: "line_items", value: altItems },
    { key: "products", value: productItems },
  ];
  const bases = [basePayload, typePayload];

  const bodies: Record<string, unknown>[] = [];
  bases.forEach((base) => {
    itemVariants.forEach((variant) => {
      tableFields.forEach((tableField) => {
        const body: Record<string, unknown> = {
          ...base,
          [variant.key]: variant.value,
        };
        if (tableField) {
          body[tableField] = payload.table;
        }
        bodies.push(body);
      });
    });
  });

  const isRetryable = (error: unknown) => {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    return status === 400 || status === 404 || status === 405 || status === 415;
  };

  const postOrder = async (
    body: Record<string, unknown>,
    options?: ApiFetchOptions
  ) => {
    const response = await apiFetch<ApiOrderCreated | Root<ApiOrderCreated>>(
      "/api/orders/",
      {
        method: "POST",
        body: JSON.stringify(body),
        ...options,
      }
    );
    return unwrapRoot(response);
  };

  const tryBodies = async (options?: ApiFetchOptions) => {
    let lastError: unknown = null;
    for (const body of bodies) {
      try {
        return await postOrder(body, options);
      } catch (error) {
        lastError = error;
        if (!isRetryable(error)) {
          throw error;
        }
      }
    }
    if (lastError) {
      throw lastError;
    }
    throw new Error("Order request failed.");
  };

  try {
    return await tryBodies();
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    if (!isAuthError(status)) {
      throw error;
    }
  }

  return await tryBodies({ skipAuth: true, skipRefresh: true });
};

export const createCallRequest = async (
  payload: ApiCallRequestCreate
): Promise<ApiCallRequest> => {
  const postCall = async (body: Record<string, unknown>) => {
    const response = await apiFetch<ApiCallRequest | Root<ApiCallRequest>>(
      "/api/call-requests/",
      {
        method: "POST",
        body: JSON.stringify(body),
      }
    );
    return unwrapRoot(response);
  };

  const isBadRequest = (error: unknown) => {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    return status === 400;
  };

  try {
    return await postCall(payload);
  } catch (error) {
    if (!isBadRequest(error)) {
      throw error;
    }
  }

  try {
    return await postCall({ type: payload.type, table_id: payload.table });
  } catch (error) {
    if (!isBadRequest(error)) {
      throw error;
    }
  }

  try {
    return await postCall({
      type: payload.type,
      table_number: payload.table,
    });
  } catch (error) {
    if (!isBadRequest(error)) {
      throw error;
    }
  }

  try {
    const tables = await fetchAllPages<ApiTable>("/api/tables/?page_size=200");
    const match = tables.find((table) => table.number === payload.table);
    if (match) {
      return await postCall({ type: payload.type, table_id: match.id });
    }
  } catch {
    // ignore table lookup errors
  }

  return await postCall(payload);
};

export const fetchMenuTables = async (): Promise<ApiTable[]> => {
  if (!getApiBaseUrl()) {
    return [];
  }
  const path = "/api/tables/?page_size=200";
  const primary = await fetchAllPagesSafe<ApiTable>(path);
  if (primary.ok) {
    return primary.data;
  }
  if (isAuthError(primary.status)) {
    const fallback = await fetchAllPagesSafe<ApiTable>(path, {
      skipAuth: true,
      skipRefresh: true,
    });
    if (fallback.ok) {
      return fallback.data;
    }
  }
  return [];
};

export const createMenuReservation = async (
  payload: ApiReservationCreate
): Promise<ApiReservation> => {
  const postReservation = async (options?: ApiFetchOptions) => {
    const response = await apiFetch<ApiReservation | Root<ApiReservation>>(
      "/api/reservations/",
      {
        method: "POST",
        body: JSON.stringify(payload),
        ...options,
      }
    );
    return unwrapRoot(response);
  };

  try {
    return await postReservation();
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    if (!isAuthError(status)) {
      throw error;
    }
  }

  return await postReservation({ skipAuth: true, skipRefresh: true });
};

export const fetchMenuItemById = async (
  id: number
): Promise<MenuItem | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }

  try {
    const productPayload = await apiFetch<ApiProduct | Root<ApiProduct>>(
      `/api/products/${id}/`
    );
    const product = unwrapRoot(productPayload);
    if (!product || typeof product !== "object" || !("id" in product)) {
      return null;
    }
    return mapProduct(product as ApiProduct);
  } catch {
    try {
      const productPayload = await apiFetch<ApiProduct | Root<ApiProduct>>(
        `/api/products/${id}/`,
        { skipAuth: true, skipRefresh: true }
      );
      const product = unwrapRoot(productPayload);
      if (!product || typeof product !== "object" || !("id" in product)) {
        return null;
      }
      return mapProduct(product as ApiProduct);
    } catch {
      return null;
    }
  }
};

