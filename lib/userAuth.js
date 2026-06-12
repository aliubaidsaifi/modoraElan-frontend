"use client";
const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const TOKEN = "modora_customer_token";
const USER = "modora_customer_user";

async function authReq(path, body) {
  const res = await fetch(`${API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
}

export const userAuth = {
  register: (name, email, password, phone) =>
    authReq("/auth/register", { name, email, password, phone }),
  login: (email, password) => authReq("/auth/login", { email, password }),
  getToken: () => (typeof window !== "undefined" ? localStorage.getItem(TOKEN) : null),
  setSession: (token, user) => {
    localStorage.setItem(TOKEN, token);
    localStorage.setItem(USER, JSON.stringify(user));
  },
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER)); } catch { return null; }
  },
  clear: () => { localStorage.removeItem(TOKEN); localStorage.removeItem(USER); },
  isLoggedIn: () => typeof window !== "undefined" && !!localStorage.getItem(TOKEN),
};