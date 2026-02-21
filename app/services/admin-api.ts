"use client";

import { apiFetch, getApiBaseUrl } from "./api-client";

export interface Root<T = unknown> {
  success: boolean;
  data: T;
  message: string;
}

export interface Data<T = unknown> {
  count: number;
  next: unknown;
  previous: unknown;
  results: T[];
}

export type Paginated<T> = Data<T>;
export type ApiRoot<T> = Root<T>;
export type PaginatedPage<T> = Omit<Paginated<T>, "next" | "previous"> & {
  next: string | null;
  previous: string | null;
};

export type ApiCategory = {
  id: number;
  name_ar: string;
  name_en?: string | null;
  slug?: string | null;
  is_active?: boolean;
  sort_order?: number | null;
};

export type ApiTag = {
  id: number;
  code: string;
  name_ar: string;
  color_key?: string | null;
};

export type ApiOffer = {
  id: number;
  title_ar: string;
  description_ar?: string | null;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: string;
  start_at: string;
  end_at: string;
  is_active?: boolean;
  image?: string | null;
  applies_to_products?: number[] | null;
  applies_to_categories?: number[] | null;
};

export type ApiProductRead = {
  id: number;
  name_ar: string;
  description_ar?: string | null;
  category?: {
    id: number;
    name_ar: string;
    name_en?: string | null;
    slug?: string | null;
    is_active?: boolean;
  } | null;
  price: string;
  image?: string | null;
  is_available?: boolean;
  tags?: ApiTag[] | null;
  extras?: ApiProductExtra[] | null;
};

export type ApiProductExtra = {
  id: number;
  name_ar: string;
  name_en?: string | null;
  price: string;
};

export type ApiOrderItemRead = {
  id: number;
  product: number;
  product_name: string;
  qty: number;
  unit_price: string;
  line_total: string;
  notes?: string | null;
};

export type ApiOrderRead = {
  id: number;
  status: "NEW" | "PREPARING" | "SERVED" | "CANCELLED";
  payment_status: "UNPAID" | "PAID" | "PARTIAL";
  order_type: "DINE_IN" | "TAKEAWAY" | "DELIVERY";
  table?: number | null;
  subtotal?: string | null;
  discount_total?: string | null;
  total?: string | null;
  notes?: string | null;
  created_at: string;
  updated_at: string;
  served_at?: string | null;
  cancelled_at?: string | null;
  items: ApiOrderItemRead[];
};

export type ApiPayment = {
  id: number;
  order: number;
  amount: string;
  method: "CASH" | "CARD" | "ONLINE";
  status: "SUCCESS" | "FAILED" | "PENDING";
  paid_at?: string | null;
  created_at: string;
};

export type ApiReservation = {
  id: number;
  code?: string;
  customer_name: string;
  phone: string;
  start_at: string;
  end_at?: string | null;
  party_size: number;
  table?: number | null;
  status: "PENDING" | "CONFIRMED" | "CANCELLED" | "NO_SHOW";
  created_at?: string;
  confirmed_at?: string | null;
  cancelled_at?: string | null;
};

export type ApiTable = {
  id: number;
  number: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
  current_order?: number | null;
  created_at?: string;
  updated_at?: string;
};

export type ApiCallRequest = {
  id: number;
  table: number;
  type: "BILL_REQUEST" | "HELP" | "EXTRA_ORDER" | "PROBLEM";
  status: "NEW" | "HANDLED" | "CANCELLED";
  created_at: string;
  handled_by?: number | null;
  handled_at?: string | null;
};

export type ApiUser = {
  id: number;
  email: string;
  full_name: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  is_active: boolean;
  created_at?: string;
};

export type ApiQRCode = {
  id: number;
  type: "MENU_ONLY" | "TABLE_MENU";
  table?: number | null;
  payload_url: string;
  include_logo?: boolean;
  colored_frame?: boolean;
  png_file?: string | null;
  svg_file?: string | null;
  pdf_file?: string | null;
  created_at?: string;
};

export type ApiQRSettings = {
  id: number;
  base_url: string;
  default_qr_type: "MENU_ONLY" | "TABLE_MENU";
  include_logo_default?: boolean;
  colored_frame_default?: boolean;
  logo?: string | null;
};

export type ApiDashboardSummary = {
  new_orders_count: number;
  today_sales_total: string;
  today_orders_count: number;
  today_reservations_count: number;
  open_call_requests_count: number;
  paid_vs_unpaid: {
    paid: number;
    unpaid: number;
    partial: number;
  };
};

export type ApiOrderStatusChart = {
  NEW: number;
  PREPARING: number;
  SERVED: number;
  CANCELLED: number;
};

export type ApiSalesTrendItem = {
  date: string;
  total: string;
};

export type ApiActivityFeedItem = {
  action_type: string;
  message_ar: string;
  entity_type: string;
  entity_id?: number | null;
  created_at: string;
};

type CategoryWritePayload = {
  name_ar: string;
  name_en?: string | null;
  slug: string;
  is_active?: boolean;
  sort_order?: number | null;
};

type TagWritePayload = {
  name_ar: string;
  name_en?: string | null;
  code?: string | null;
  color_key?: string | null;
};

type ProductWritePayload = {
  name_ar: string;
  description_ar?: string | null;
  category: number;
  price: string;
  image?: string | null;
  is_available?: boolean;
  tag_ids?: number[];
  extras?: ProductExtraWritePayload[];
};

type ProductExtraWritePayload = {
  id?: number;
  name_ar: string;
  name_en?: string | null;
  price: string;
};

type OfferWritePayload = {
  title_ar: string;
  description_ar?: string | null;
  type: "PERCENT" | "FIXED_AMOUNT";
  value: string;
  start_at: string;
  end_at: string;
  is_active?: boolean;
  image?: string | null;
  applies_to_products?: number[];
  applies_to_categories?: number[];
};

type ReservationWritePayload = {
  customer_name: string;
  phone: string;
  start_at: string;
  party_size: number;
  table?: number | null;
  status?: "PENDING" | "CONFIRMED" | "CANCELLED" | "NO_SHOW";
};

type TableWritePayload = {
  number: number;
  capacity: number;
  status: "AVAILABLE" | "OCCUPIED" | "RESERVED";
};

type UserCreatePayload = {
  email: string;
  full_name: string;
  role: "OWNER" | "MANAGER" | "STAFF";
  password: string;
  is_active?: boolean;
};

type UserUpdatePayload = {
  email?: string;
  full_name?: string;
  role?: "OWNER" | "MANAGER" | "STAFF";
  is_active?: boolean;
};

type QrGeneratePayload = {
  type: "MENU_ONLY" | "TABLE_MENU";
  table_id?: number | null;
  table_number?: number | null;
  table?: number | null;
  include_logo?: boolean;
  colored_frame?: boolean;
};

type QrSettingsPatchPayload = {
  base_url?: string;
  default_qr_type?: "MENU_ONLY" | "TABLE_MENU";
  include_logo_default?: boolean;
  colored_frame_default?: boolean;
  logo?: string | null;
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

type MaybeRoot<T> = T | Root<T>;
type PaginatedPayload<T> = Paginated<T> | Root<Paginated<T>> | T[] | Root<T[]>;

const unwrapRoot = <T>(payload: MaybeRoot<T>): T => {
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as Root<T>).data;
  }
  return payload as T;
};

const unwrapPaginated = <T>(payload: PaginatedPayload<T>): Paginated<T> => {
  const unwrapped = unwrapRoot(payload as MaybeRoot<Paginated<T> | T[]>);
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

const apiGet = async <T>(
  path: string,
  options?: Parameters<typeof apiFetch>[1]
): Promise<T> => {
  const payload: MaybeRoot<T> = await apiFetch<MaybeRoot<T>>(path, options);
  return unwrapRoot(payload);
};

const fetchAllPages = async <T>(path: string): Promise<T[]> => {
  const results: T[] = [];
  let nextPath: string | null = path;
  let safety = 0;

  while (nextPath && safety < 50) {
    const payload: PaginatedPayload<T> =
      await apiFetch<PaginatedPayload<T>>(nextPath);
    const pageData: Paginated<T> = unwrapPaginated(payload);

    if (!pageData || !Array.isArray(pageData.results)) {
      break;
    }

    results.push(...pageData.results);
    nextPath = normalizePath(pageData.next);
    safety += 1;
  }

  return results;
};

export const fetchCategories = async (): Promise<ApiCategory[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiCategory>("/api/categories/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchProducts = async (): Promise<ApiProductRead[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiProductRead>("/api/products/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchProductsPage = async (
  path?: string
): Promise<PaginatedPage<ApiProductRead> | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    const nextPath =
      normalizePath(path) ?? "/api/products/?page_size=50";
    const payload: PaginatedPayload<ApiProductRead> =
      await apiFetch<PaginatedPayload<ApiProductRead>>(nextPath);
    const pageData = unwrapPaginated(payload);
    return {
      ...pageData,
      next: normalizePath(pageData.next),
      previous: normalizePath(pageData.previous),
    };
  } catch {
    return null;
  }
};

export const fetchTags = async (): Promise<ApiTag[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiTag>("/api/tags/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchOffers = async (): Promise<ApiOffer[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiOffer>("/api/offers/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchOrders = async (): Promise<ApiOrderRead[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiOrderRead>("/api/orders/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchPayments = async (): Promise<ApiPayment[]> => {
  if (!getApiBaseUrl()) {
    throw new Error("API base URL is missing.");
  }
  try {
    return await fetchAllPages<ApiPayment>("/api/payments/?page_size=200");
  } catch (error) {
    const status =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    if (status === 404) {
      return await fetchAllPages<ApiPayment>("/api/payments?page_size=200");
    }
    throw error;
  }
};

export const fetchReservations = async (): Promise<ApiReservation[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiReservation>(
      "/api/reservations/?page_size=200"
    );
  } catch {
    return null;
  }
};

export const fetchTables = async (): Promise<ApiTable[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiTable>("/api/tables/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchCallRequests = async (): Promise<ApiCallRequest[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiCallRequest>(
      "/api/call-requests/?page_size=200"
    );
  } catch {
    return null;
  }
};

export const fetchUsers = async (): Promise<ApiUser[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiUser>("/api/users/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchQrCodes = async (): Promise<ApiQRCode[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiQRCode>("/api/qr/?page_size=200");
  } catch {
    return null;
  }
};

export const fetchQrSettings = async (): Promise<ApiQRSettings | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await apiGet<ApiQRSettings>("/api/qr/settings/");
  } catch {
    return null;
  }
};

export const fetchDashboardSummary =
  async (): Promise<ApiDashboardSummary | null> => {
    if (!getApiBaseUrl()) {
      return null;
    }
    try {
      return await apiGet<ApiDashboardSummary>("/api/dashboard/summary/");
    } catch {
      return null;
    }
  };

export const fetchOrderStatusChart =
  async (): Promise<ApiOrderStatusChart | null> => {
    if (!getApiBaseUrl()) {
      return null;
    }
    try {
      return await apiGet<ApiOrderStatusChart>(
        "/api/dashboard/charts/order-status/"
      );
    } catch {
      return null;
    }
  };

export const fetchSalesTrend = async (): Promise<ApiSalesTrendItem[] | null> => {
  if (!getApiBaseUrl()) {
    return null;
  }
  try {
    return await fetchAllPages<ApiSalesTrendItem>(
      "/api/dashboard/charts/sales-trend/?page_size=200"
    );
  } catch {
    return null;
  }
};

export const fetchActivityFeed =
  async (): Promise<ApiActivityFeedItem[] | null> => {
    if (!getApiBaseUrl()) {
      return null;
    }
    try {
      return await fetchAllPages<ApiActivityFeedItem>(
        "/api/dashboard/activity/?page_size=20"
      );
    } catch {
      return null;
    }
  };

export const createCategory = async (
  payload: CategoryWritePayload
): Promise<ApiCategory> => {
  return apiGet<ApiCategory>("/api/categories/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const createTag = async (
  payload: TagWritePayload
): Promise<ApiTag> => {
  return apiGet<ApiTag>("/api/tags/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateCategory = async (
  id: number,
  payload: CategoryWritePayload
): Promise<ApiCategory> => {
  return apiGet<ApiCategory>(`/api/categories/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const toggleCategoryActive = async (
  id: number,
  isActive: boolean
): Promise<ApiCategory> => {
  return apiGet<ApiCategory>(`/api/categories/${id}/`, {
    method: "PATCH",
    body: JSON.stringify({ is_active: isActive }),
  });
};

export const deleteCategory = async (id: number): Promise<void> => {
  await apiFetch<void>(`/api/categories/${id}/`, { method: "DELETE" });
};

const buildProductBody = (
  payload: ProductWritePayload,
  imageFile?: File | null
) => {
  const sanitized: ProductWritePayload = { ...payload };
  const hasExtras = Object.prototype.hasOwnProperty.call(sanitized, "extras");
  const normalizedExtras = hasExtras
    ? (sanitized.extras ?? [])
        .map((extra) => ({
          id: extra.id,
          name_ar: extra.name_ar?.trim() || "",
          name_en: extra.name_en?.trim() || undefined,
          price: String(extra.price ?? "").trim(),
        }))
        .filter((extra) => extra.name_ar && extra.price)
    : [];

  if (!sanitized.tag_ids?.length) {
    delete sanitized.tag_ids;
  }
  if (sanitized.description_ar === "") {
    delete sanitized.description_ar;
  }
  if (typeof sanitized.is_available === "undefined") {
    delete sanitized.is_available;
  }
  if (hasExtras) {
    sanitized.extras = normalizedExtras;
  } else {
    delete sanitized.extras;
  }

  if (imageFile) {
    const data = new FormData();
    data.append("name_ar", sanitized.name_ar);
    if (sanitized.description_ar) {
      data.append("description_ar", sanitized.description_ar);
    }
    data.append("category", String(sanitized.category));
    data.append("price", String(sanitized.price));
    if (typeof sanitized.is_available === "boolean") {
      data.append("is_available", String(sanitized.is_available));
    }
    if (sanitized.tag_ids?.length) {
      sanitized.tag_ids.forEach((tagId) => {
        data.append("tag_ids", String(tagId));
      });
    }
    if (hasExtras) {
      data.append("extras", JSON.stringify(normalizedExtras));
    }
    data.append("image", imageFile);
    return data;
  }

  return JSON.stringify(sanitized);
};

const buildOfferBody = (
  payload: OfferWritePayload | Partial<OfferWritePayload>,
  imageFile?: File | null
) => {
  const sanitized: Partial<OfferWritePayload> = { ...payload };

  if (sanitized.description_ar === "") {
    delete sanitized.description_ar;
  }
  if (!sanitized.applies_to_products?.length) {
    delete sanitized.applies_to_products;
  }
  if (!sanitized.applies_to_categories?.length) {
    delete sanitized.applies_to_categories;
  }
  if (typeof sanitized.is_active === "undefined") {
    delete sanitized.is_active;
  }

  if (imageFile) {
    const data = new FormData();
    Object.entries(sanitized).forEach(([key, value]) => {
      if (value === null || typeof value === "undefined") {
        return;
      }
      if (Array.isArray(value)) {
        value.forEach((item) => data.append(key, String(item)));
        return;
      }
      data.append(key, String(value));
    });
    data.append("image", imageFile);
    return data;
  }

  return JSON.stringify(sanitized);
};

export const createProduct = async (
  payload: ProductWritePayload,
  imageFile?: File | null
): Promise<ApiProductRead> => {
  const body = buildProductBody(payload, imageFile);
  return apiGet<ApiProductRead>("/api/products/", {
    method: "POST",
    body,
  });
};

export const updateProduct = async (
  id: number,
  payload: ProductWritePayload,
  imageFile?: File | null
): Promise<ApiProductRead> => {
  const body = buildProductBody(payload, imageFile);
  return apiGet<ApiProductRead>(`/api/products/${id}/`, {
    method: "PATCH",
    body,
  });
};

export const deleteProduct = async (id: number): Promise<void> => {
  const attemptDelete = async (path: string, method: "DELETE" | "POST") => {
    await apiFetch<void>(path, { method });
  };
  const getStatus = (error: unknown) =>
    typeof error === "object" && error && "status" in error
      ? Number((error as { status?: number }).status)
      : null;

  try {
    await attemptDelete(`/api/products/${id}/`, "DELETE");
    return;
  } catch (error) {
    const status = getStatus(error);
    if (status !== 404 && status !== 405) {
      throw error;
    }
  }

  try {
    await attemptDelete(`/api/products/${id}`, "DELETE");
    return;
  } catch (error) {
    const status = getStatus(error);
    if (status !== 405) {
      throw error;
    }
  }

  await attemptDelete(`/api/products/${id}/delete/`, "POST");
};

export const toggleProductAvailability = async (
  id: number
): Promise<ApiProductRead> => {
  return apiGet<ApiProductRead>(`/api/products/${id}/toggle-availability/`, {
    method: "POST",
  });
};

export const createOffer = async (
  payload: OfferWritePayload,
  imageFile?: File | null
): Promise<ApiOffer> => {
  const body = buildOfferBody(payload, imageFile);
  return apiGet<ApiOffer>("/api/offers/", {
    method: "POST",
    body,
  });
};

export const updateOffer = async (
  id: number,
  payload: Partial<OfferWritePayload>,
  imageFile?: File | null
): Promise<ApiOffer> => {
  const body = buildOfferBody(payload, imageFile);
  return apiGet<ApiOffer>(`/api/offers/${id}/`, {
    method: "PATCH",
    body,
  });
};

export const deleteOffer = async (id: number): Promise<void> => {
  await apiFetch<void>(`/api/offers/${id}/`, { method: "DELETE" });
};

export const toggleOfferActive = async (
  id: number,
  isActive: boolean
): Promise<ApiOffer> => {
  return updateOffer(id, { is_active: isActive });
};

export const setOrderStatus = async (
  id: number,
  status: ApiOrderRead["status"]
): Promise<ApiOrderRead> => {
  return apiGet<ApiOrderRead>(`/api/orders/${id}/set-status/`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
};

export const createReservation = async (
  payload: ReservationWritePayload
): Promise<ApiReservation> => {
  return apiGet<ApiReservation>("/api/reservations/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateReservation = async (
  id: number,
  payload: Partial<ReservationWritePayload>
): Promise<ApiReservation> => {
  return apiGet<ApiReservation>(`/api/reservations/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const confirmReservation = async (
  id: number
): Promise<ApiReservation> => {
  return apiGet<ApiReservation>(`/api/reservations/${id}/confirm/`, {
    method: "POST",
  });
};

export const cancelReservation = async (
  id: number
): Promise<ApiReservation> => {
  return apiGet<ApiReservation>(`/api/reservations/${id}/cancel/`, {
    method: "POST",
  });
};

export const deleteReservation = async (id: number): Promise<void> => {
  await apiFetch<void>(`/api/reservations/${id}/`, { method: "DELETE" });
};

export const createTable = async (
  payload: TableWritePayload
): Promise<ApiTable> => {
  return apiGet<ApiTable>("/api/tables/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateTable = async (
  id: number,
  payload: TableWritePayload
): Promise<ApiTable> => {
  return apiGet<ApiTable>(`/api/tables/${id}/`, {
    method: "PUT",
    body: JSON.stringify(payload),
  });
};

export const deleteTable = async (id: number): Promise<void> => {
  await apiFetch<void>(`/api/tables/${id}/`, { method: "DELETE" });
};

export const changeTableStatus = async (
  id: number,
  status: ApiTable["status"]
): Promise<ApiTable> => {
  const isRetryable = (error: unknown) => {
    const code =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    return code === 400 || code === 404 || code === 405;
  };

  try {
    return await apiGet<ApiTable>(`/api/tables/${id}/`, {
      method: "PUT",
      body: JSON.stringify({ status }),
    });
  } catch (error) {
    if (!isRetryable(error)) {
      throw error;
    }
  }

  return apiGet<ApiTable>(`/api/tables/${id}/change-status/`, {
    method: "POST",
    body: JSON.stringify({ status }),
  });
};

export const handleCallRequest = async (
  id: number
): Promise<ApiCallRequest> => {
  return apiGet<ApiCallRequest>(`/api/call-requests/${id}/handle/`, {
    method: "POST",
  });
};

export const cancelCallRequest = async (
  id: number
): Promise<ApiCallRequest> => {
  return apiGet<ApiCallRequest>(`/api/call-requests/${id}/cancel/`, {
    method: "POST",
  });
};

export const createUser = async (
  payload: UserCreatePayload
): Promise<ApiUser> => {
  return apiGet<ApiUser>("/api/users/", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};

export const updateUser = async (
  id: number,
  payload: UserUpdatePayload
): Promise<ApiUser> => {
  return apiGet<ApiUser>(`/api/users/${id}/`, {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const deleteUser = async (id: number): Promise<void> => {
  await apiFetch<void>(`/api/users/${id}/`, { method: "DELETE" });
};

export const toggleUserActive = async (id: number): Promise<ApiUser> => {
  return apiGet<ApiUser>(`/api/users/${id}/toggle-active/`, {
    method: "POST",
  });
};

export const generateQrCode = async (
  payload: QrGeneratePayload
): Promise<ApiQRCode> => {
  const sanitizeBody = (value: Record<string, unknown>) => {
    const sanitized: Record<string, unknown> = {};
    Object.entries(value).forEach(([key, entry]) => {
      if (entry === null || typeof entry === "undefined") {
        return;
      }
      if (typeof entry === "number" && !Number.isFinite(entry)) {
        return;
      }
      sanitized[key] = entry;
    });
    return sanitized;
  };

  const isRetryable = (error: unknown) => {
    const code =
      typeof error === "object" && error && "status" in error
        ? Number((error as { status?: number }).status)
        : null;
    return code === 400 || code === 404 || code === 405 || code === 415;
  };

  const basePayload = {
    type: payload.type,
    include_logo: payload.include_logo,
    colored_frame: payload.colored_frame,
  };
  const tableId = Number.isFinite(payload.table_id ?? NaN)
    ? payload.table_id
    : null;
  const tableNumber = Number.isFinite(payload.table_number ?? NaN)
    ? payload.table_number
    : null;
  const tableValue = Number.isFinite(payload.table ?? NaN) ? payload.table : null;
  const fallbackTable = tableValue ?? tableId ?? tableNumber;

  const candidates: Record<string, unknown>[] = [];
  const addCandidate = (
    fullValue: Record<string, unknown>,
    minimalValue: Record<string, unknown>
  ) => {
    candidates.push(fullValue);
    candidates.push(minimalValue);
  };

  if (payload.type === "TABLE_MENU") {
    if (tableId !== null) {
      addCandidate(
        { ...basePayload, table_id: tableId },
        { type: payload.type, table_id: tableId }
      );
    }
    if (tableNumber !== null) {
      addCandidate(
        { ...basePayload, table_number: tableNumber },
        { type: payload.type, table_number: tableNumber }
      );
    }
    if (fallbackTable !== null) {
      addCandidate(
        { ...basePayload, table: fallbackTable },
        { type: payload.type, table: fallbackTable }
      );
    }
    if (!candidates.length) {
      candidates.push(basePayload);
      candidates.push({ type: payload.type });
    }
  } else {
    candidates.push(basePayload);
    candidates.push({ type: payload.type });
  }

  let lastError: unknown = null;
  for (const candidate of candidates) {
    try {
      return await apiGet<ApiQRCode>("/api/qr/generate/", {
        method: "POST",
        body: JSON.stringify(sanitizeBody(candidate)),
      });
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
  throw new Error("QR generate failed.");
};

export const updateQrSettings = async (
  payload: QrSettingsPatchPayload
): Promise<ApiQRSettings> => {
  return apiGet<ApiQRSettings>("/api/qr/settings/", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
};

export const uploadQrLogo = async (
  logoFile: File
): Promise<ApiQRSettings> => {
  const data = new FormData();
  data.append("logo", logoFile);
  return apiGet<ApiQRSettings>("/api/qr/settings/", {
    method: "PATCH",
    body: data,
  });
};
