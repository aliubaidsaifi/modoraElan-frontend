"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { adminApi } from "@/lib/adminApi";
import { auth } from "@/lib/auth";

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (e) => {
    e.preventDefault();
    setError(""); setLoading(true);
    try {
      const { token, user } = await adminApi.login(email, password);
      if (user.role !== "admin") throw new Error("Not an admin account");
      auth.setSession(token, user);
      router.replace("/admin");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8 text-center">
          Modora Élan
        </h1>
        <form onSubmit={submit} className="space-y-4">
          <input type="email" placeholder="Email" value={email}
            onChange={(e) => setEmail(e.target.value)} required
            className="w-full border border-ink/20 px-4 py-3 bg-white/60 outline-none focus:border-ink" />
          <input type="password" placeholder="Password" value={password}
            onChange={(e) => setPassword(e.target.value)} required
            className="w-full border border-ink/20 px-4 py-3 bg-white/60 outline-none focus:border-ink" />
          {error && <p className="text-red-700 text-sm">{error}</p>}
          <button disabled={loading}
            className="w-full py-3 bg-ink text-sand hover:bg-clay transition-colors disabled:opacity-50">
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
