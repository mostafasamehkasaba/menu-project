const TABLE_KEY = "menu_table_number";

const parseTableValue = (value?: string | null): number | null => {
  if (!value) {
    return null;
  }
  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed <= 0) {
    return null;
  }
  return Math.floor(parsed);
};

export const getStoredTable = (): number | null => {
  if (typeof window === "undefined") {
    return null;
  }
  return parseTableValue(window.localStorage.getItem(TABLE_KEY));
};

export const setStoredTable = (value?: number | null) => {
  if (typeof window === "undefined") {
    return;
  }
  if (!value) {
    window.localStorage.removeItem(TABLE_KEY);
    return;
  }
  window.localStorage.setItem(TABLE_KEY, String(Math.floor(value)));
};

export const parseTableParam = (value?: string | null) => {
  return parseTableValue(value);
};
