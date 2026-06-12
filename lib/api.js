const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function get(path, opts = {}) {
  try {
    const res = await fetch(`${API}${path}`, {
      next: { revalidate: 60 }, // ISR-ish caching for SEO + speed
      ...opts,
    });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export const api = {
  // products
  getProducts: (query = "") => get(`/products${query}`),
  getProduct: (slug) => get(`/products/${slug}`),
  // categories
  getCategories: () => get(`/categories`),
  // blog (from Blogger via backend)
  getPosts: () => get(`/blog`),
  getPost: (id) => get(`/blog/${id}`),
};
