const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function get(path, opts = {}) {
  try {
    const res = await fetch(`${API}${path}`, { next: { revalidate: 60 }, ...opts });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

async function authGet(path, token) {
  try {
    const res = await fetch(`${API}${path}`, { headers: { Authorization: `Bearer ${token}` }, cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}
async function getFresh(path) {
  try {
    const res = await fetch(`${API}${path}`, { cache: "no-store" });
    if (!res.ok) return null;
    return res.json();
  } catch { return null; }
}

async function send(path, method, token, body) {
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body) headers["Content-Type"] = "application/json";
  const res = await fetch(`${API}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const api = {
  getBanner: () => get(`/banners/hero`),
  getProducts: (query = "") => get(`/products${query}`),
  getProduct: (slug) => get(`/products/${slug}`),
  getCategories: () => get(`/categories`),
  getPosts: () => get(`/blog`),
  getPost: (id) => get(`/blog/${id}`),
  createOrder: (data, token) => send(`/orders`, "POST", token, data),
  getAddresses: (token) => authGet(`/users/addresses`, token),
  addAddress: (data, token) => send(`/users/addresses`, "POST", token, data),
  deleteAddress: (id, token) => send(`/users/addresses/${id}`, "DELETE", token),
  setDefaultAddress: (id, token) => send(`/users/addresses/${id}/default`, "PATCH", token),
  getActiveBanners: () => getFresh(`/banners/active`),
};