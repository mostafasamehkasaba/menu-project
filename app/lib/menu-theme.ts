"use client";

export type MenuTheme = "light" | "dark";

const STORAGE_KEY = "menu_v3_theme";

export const getMenuTheme = (): MenuTheme => {
  if (typeof window === "undefined") {
    return "light";
  }
  const stored = window.localStorage.getItem(STORAGE_KEY);
  return stored === "dark" ? "dark" : "light";
};

export const applyMenuTheme = (theme: MenuTheme) => {
  if (typeof window === "undefined") {
    return;
  }
  const className = "menu-v3-dark";
  const targets = [document.body, document.documentElement];
  targets.forEach((node) => {
    if (theme === "dark") {
      node.classList.add(className);
    } else {
      node.classList.remove(className);
    }
  });
};

export const setMenuTheme = (theme: MenuTheme) => {
  if (typeof window === "undefined") {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, theme);
  applyMenuTheme(theme);
};
