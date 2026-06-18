const KEY = "modora_recently_viewed";

export function addRecentlyViewed(product) {
  if (typeof window === "undefined") return;
  try {
    const item = {
      _id: product._id, slug: product.slug, name: product.name,
      price: product.price, compareAtPrice: product.compareAtPrice || 0,
      image: product.images?.[0] || "",
    };
    const list = JSON.parse(localStorage.getItem(KEY) || "[]").filter((p) => p._id !== item._id);
    list.unshift(item);
    localStorage.setItem(KEY, JSON.stringify(list.slice(0, 12)));
  } catch {}
}

export function getRecentlyViewed() {
  if (typeof window === "undefined") return [];
  try { return JSON.parse(localStorage.getItem(KEY) || "[]"); } catch { return []; }
}