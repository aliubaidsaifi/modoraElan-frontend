"use client";
import { auth } from "./auth";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

async function authed(path, options = {}) {
  const token = auth.getToken();
  const headers = { ...(options.headers || {}) };
  if (token) headers.Authorization = `Bearer ${token}`;
  if (options.body && !(options.body instanceof FormData))
    headers["Content-Type"] = "application/json";

  const res = await fetch(`${API}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const adminApi = {
  login: (email, password) =>
    authed("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) }),
  uploadImage: (file) => {
    const fd = new FormData();
    fd.append("image", file);
    return authed("/upload", { method: "POST", body: fd });
  },
  getProducts: () => authed("/products"),
  getProduct: (slug) => authed(`/products/${slug}`),
  createProduct: (data) => authed("/products", { method: "POST", body: JSON.stringify(data) }),
  updateProduct: (id, data) =>
    authed(`/products/${id}`, { method: "PATCH", body: JSON.stringify(data) }),
  deleteProduct: (id) => authed(`/products/${id}`, { method: "DELETE" }),
  getCategories: () => authed("/categories"),
  createCategory: (data) =>
    authed("/categories", { method: "POST", body: JSON.stringify(data) }),
};