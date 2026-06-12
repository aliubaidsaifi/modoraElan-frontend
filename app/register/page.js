"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userAuth } from "@/lib/userAuth";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", phone: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }));
  const field =
    "w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-ink placeholder:text-ink/40 transition-colors";

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { token, user } = await userAuth.register(form.name, form.email, form.password, form.phone);
      userAuth.setSession(token, user);
      router.push("/account");
    } catch (err) { setError(err.message); setLoading(false); }
  };

  return (
    <div className="grid md:grid-cols-2 min-h-[calc(100vh-4rem)]">
      {/* Editorial panel */}
      <div className="hidden md:flex flex-col justify-between bg-ink text-sand p-12">
        <span className="font-[family-name:var(--font-display)] text-2xl">Modora Élan</span>
        <div>
          <h2 className="font-[family-name:var(--font-display)] text-5xl leading-[1.05]">
            Join the<br />Élan circle.
          </h2>
          <p className="mt-5 text-sand/60 max-w-xs">
            Create an account for faster checkout, order tracking, and early access to new drops.
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-sand/40">Modest wear · Delhi</span>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16 bg-sand">
        <div className="w-full max-w-sm">
          <p className="uppercase tracking-[0.3em] text-xs text-clay mb-3">Account</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl mb-8">Create account</h1>
          <form onSubmit={submit} className="space-y-6">
            <input className={field} placeholder="Full name" value={form.name} onChange={(e) => set("name", e.target.value)} required />
            <input className={field} type="email" placeholder="Email" value={form.email} onChange={(e) => set("email", e.target.value)} required />
            <input className={field} placeholder="Phone (WhatsApp)" value={form.phone} onChange={(e) => set("phone", e.target.value)} />
            <input className={field} type="password" placeholder="Password" value={form.password} onChange={(e) => set("password", e.target.value)} required />
            {error && <p className="text-red-700 text-sm">{error}</p>}
            <button disabled={loading} className="w-full py-4 bg-ink text-sand hover:bg-clay transition-colors disabled:opacity-50 tracking-wide">
              {loading ? "Creating..." : "Sign Up"}
            </button>
          </form>
          <p className="text-sm mt-8 text-ink/60">
            Already have an account? <Link href="/login" className="text-clay hover:underline">Log in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}