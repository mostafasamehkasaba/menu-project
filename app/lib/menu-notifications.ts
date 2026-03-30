"use client";

import type { LocalizedText } from "./i18n";

export type MenuNotification = {
  id: string;
  title: LocalizedText;
  body: LocalizedText;
  createdAt: string;
  read: boolean;
  type?: "BOOKING" | "ORDER" | "PAYMENT" | "CART" | "INFO";
};

const STORAGE_KEY = "menu_notifications";
const MAX_ITEMS = 60;

const readNotifications = (): MenuNotification[] => {
  if (typeof window === "undefined") {
    return [];
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }
    const parsed = JSON.parse(raw) as MenuNotification[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

const writeNotifications = (items: MenuNotification[]) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

const emitNotifications = () => {
  if (typeof window === "undefined") {
    return;
  }
  window.dispatchEvent(new Event("menu:notifications"));
  if ("BroadcastChannel" in window) {
    try {
      const channel = new BroadcastChannel("menu_notifications");
      channel.postMessage({ type: "SYNC" });
      channel.close();
    } catch {
      // ignore
    }
  }
};

export const getMenuNotifications = () => readNotifications();

export const pushMenuNotification = (
  payload: Omit<MenuNotification, "id" | "createdAt" | "read">
) => {
  const entry: MenuNotification = {
    ...payload,
    id: `mn-${Date.now()}-${Math.random().toString(16).slice(2, 6)}`,
    createdAt: new Date().toISOString(),
    read: false,
  };
  const items = [entry, ...readNotifications()].slice(0, MAX_ITEMS);
  writeNotifications(items);
  emitNotifications();
};

export const markMenuNotificationRead = (id: string) => {
  const items = readNotifications().map((item) =>
    item.id === id ? { ...item, read: true } : item
  );
  writeNotifications(items);
  emitNotifications();
};

export const markAllMenuNotificationsRead = () => {
  const items = readNotifications().map((item) => ({ ...item, read: true }));
  writeNotifications(items);
  emitNotifications();
};

export const clearMenuNotifications = () => {
  writeNotifications([]);
  emitNotifications();
};

export const subscribeMenuNotifications = (
  callback: (items: MenuNotification[]) => void
) => {
  if (typeof window === "undefined") {
    return () => {};
  }

  const handle = () => callback(readNotifications());
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) {
      handle();
    }
  };

  window.addEventListener("menu:notifications", handle);
  window.addEventListener("storage", onStorage);

  let channel: BroadcastChannel | null = null;
  if ("BroadcastChannel" in window) {
    try {
      channel = new BroadcastChannel("menu_notifications");
      channel.onmessage = handle;
    } catch {
      channel = null;
    }
  }

  return () => {
    window.removeEventListener("menu:notifications", handle);
    window.removeEventListener("storage", onStorage);
    if (channel) {
      channel.close();
    }
  };
};
