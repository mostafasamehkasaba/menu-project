"use client";

type ApiFetchOptions = RequestInit & {
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

const normalizePath = (path: string) => {
  const [pathname] = path.split("?");
  if (!pathname) {
    return "/";
  }
  const trimmed = pathname.replace(/\/+$/, "");
  return trimmed || "/";
};

const today = () => {
  const now = new Date();
  now.setHours(0, 0, 0, 0);
  return now;
};

const toDateString = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const buildSalesTrend = () => {
  const start = today();
  return Array.from({ length: 7 }).map((_, index) => {
    const date = new Date(start);
    date.setDate(start.getDate() - (6 - index));
    return {
      date: toDateString(date),
      total: String(1200 + index * 240),
    };
  });
};

const buildActivityFeed = () => {
  const now = new Date();
  const makeItem = (minutesAgo: number, message: string) => ({
    action_type: "INFO",
    message_ar: message,
    entity_type: "ORDER",
    entity_id: Math.floor(Math.random() * 500) + 1,
    created_at: new Date(now.getTime() - minutesAgo * 60000).toISOString(),
  });

  return [
    makeItem(10, "تم إنشاء طلب جديد للطاولة 7"),
    makeItem(35, "تم تحديث حالة الطلب إلى قيد التحضير"),
    makeItem(55, "تم إنهاء طلب رقم 214"),
  ];
};

const listEndpoints = [
  "/api/categories",
  "/api/products",
  "/api/tags",
  "/api/offers",
  "/api/orders",
  "/api/reservations",
  "/api/tables",
  "/api/call-requests",
  "/api/users",
  "/api/qr",
  "/api/payments",
];

const parseBody = (body?: RequestInit["body"]) => {
  if (!body) {
    return null;
  }
  if (typeof body === "string") {
    try {
      return JSON.parse(body);
    } catch {
      return body;
    }
  }
  if (typeof FormData !== "undefined" && body instanceof FormData) {
    const data: Record<string, unknown> = {};
    body.forEach((value, key) => {
      data[key] = value;
    });
    return data;
  }
  return null;
};

export const mockApiFetch = async <T>(
  path: string,
  options: ApiFetchOptions = {}
): Promise<T> => {
  const method = (options.method ?? "GET").toUpperCase();
  const normalized = normalizePath(path);

  if (normalized === "/api/auth/login") {
    return {
      access: "demo-access-token",
      refresh: "demo-refresh-token",
    } as T;
  }

  if (normalized === "/api/auth/refresh") {
    return {
      access: "demo-access-token",
    } as T;
  }

  if (normalized === "/api/dashboard/summary") {
    return {
      new_orders_count: 4,
      today_sales_total: "5400",
      today_orders_count: 18,
      today_reservations_count: 3,
      open_call_requests_count: 2,
      paid_vs_unpaid: { paid: 11, unpaid: 5, partial: 2 },
    } as T;
  }

  if (normalized === "/api/dashboard/charts/order-status") {
    return {
      NEW: 6,
      PREPARING: 4,
      SERVED: 9,
      CANCELLED: 1,
    } as T;
  }

  if (normalized === "/api/dashboard/charts/sales-trend") {
    return buildSalesTrend() as T;
  }

  if (normalized === "/api/dashboard/activity") {
    return buildActivityFeed() as T;
  }

  if (listEndpoints.some((endpoint) => normalized.startsWith(endpoint))) {
    return [] as T;
  }

  if (method === "DELETE") {
    return null as T;
  }

  if (method === "POST" || method === "PUT" || method === "PATCH") {
    const payload = parseBody(options.body);
    if (payload && typeof payload === "object") {
      return { id: 1, ...(payload as Record<string, unknown>) } as T;
    }
    return { id: 1 } as T;
  }

  return null as T;
};
