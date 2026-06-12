"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userAuth } from "@/lib/userAuth";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const field =
    "w-full border-b border-ink/20 bg-transparent py-3 outline-none focus:border-ink placeholder:text-ink/40 transition-colors";

  const submit = async (e) => {
    e.preventDefault(); setError(""); setLoading(true);
    try {
      const { token, user } = await userAuth.login(email, password);
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
            Grace in<br />every drape.
          </h2>
          <p className="mt-5 text-sand/60 max-w-xs">
            Log in to track your orders, save favourites, and check out faster.
          </p>
        </div>
        <span className="text-xs uppercase tracking-[0.3em] text-sand/40">Modest wear · Delhi</span>
      </div>

      {/* Form panel */}
      <div className="flex items-center justify-center px-6 py-16 bg-sand">
        <div className="w-full max-w-sm">
          <p className="uppercase tracking-[0.3em] text-xs text-clay mb-3">Account</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl mb-8">Welcome back</h1>
          <form onSubmit={submit} className="space-y-6">
            <input className={field} type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <input className={field} type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            {error && <p className="text-red-700 text-sm">{error}</p>}
            <button disabled={loading} className="w-full py-4 bg-ink text-sand hover:bg-clay transition-colors disabled:opacity-50 tracking-wide">
              {loading ? "Signing in..." : "Log In"}
            </button>
          </form>
          <p className="text-sm mt-8 text-ink/60">
            New to Modora Élan? <Link href="/register" className="text-clay hover:underline">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}