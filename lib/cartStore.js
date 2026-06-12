"use client";
import { create } from "zustand";

export const useCart = create((set, get) => ({
  items: [],
  add: (item) =>
    set((s) => {
      const matchKey = `${item.productId}|${item.size}|${item.measurements ? JSON.stringify(item.measurements) : ""}`;
      const found = s.items.find((i) => i.matchKey === matchKey);
      if (found) {
        return { items: s.items.map((i) => (i === found ? { ...i, quantity: i.quantity + 1 } : i)) };
      }
      return {
        items: [
          ...s.items,
          { ...item, matchKey, id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, quantity: 1 },
        ],
      };
    }),
  remove: (id) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
  clear: () => set({ items: [] }),
  count: () => get().items.reduce((n, i) => n + i.quantity, 0),
  total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
}));