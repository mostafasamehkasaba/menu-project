export type CartItem = {
  id: number;
  name: string;
  price: number;
  image: string;
  qty: number;
};

const STORAGE_KEY = "menu-cart";

const safeParse = (value: string | null) => {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
};

export const getCartItems = (): CartItem[] => {
  if (typeof window === "undefined") {
    return [];
  }

  return safeParse(window.localStorage.getItem(STORAGE_KEY));
};

export const saveCartItems = (items: CartItem[]) => {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
};

export const addToCart = (
  item: Omit<CartItem, "qty">,
  quantity = 1
) => {
  const items = getCartItems();
  const existing = items.find((entry) => entry.id === item.id);

  if (existing) {
    existing.qty += quantity;
    existing.name = item.name;
    existing.price = item.price;
    existing.image = item.image;
  } else {
    items.push({ ...item, qty: quantity });
  }

  saveCartItems(items);
  return items;
};

export const updateCartItem = (id: number, qty: number) => {
  const items = getCartItems();
  const nextItems = items
    .map((entry) => (entry.id === id ? { ...entry, qty } : entry))
    .filter((entry) => entry.qty > 0);

  saveCartItems(nextItems);
  return nextItems;
};

export const removeCartItem = (id: number) => {
  const items = getCartItems().filter((entry) => entry.id !== id);
  saveCartItems(items);
  return items;
};
