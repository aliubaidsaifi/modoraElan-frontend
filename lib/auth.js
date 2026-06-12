"use client";
const TOKEN_KEY = "modora_token";
const USER_KEY = "modora_user";

export const auth = {
  getToken: () =>
    typeof window !== "undefined" ? localStorage.getItem(TOKEN_KEY) : null,
  setSession: (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
  },
  getUser: () => {
    try { return JSON.parse(localStorage.getItem(USER_KEY)); } catch { return null; }
  },
  clear: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },
  isLoggedIn: () =>
    typeof window !== "undefined" && !!localStorage.getItem(TOKEN_KEY),
};