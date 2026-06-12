"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const isLogin = pathname === "/admin/login";

  useEffect(() => {
    if (!isLogin && !auth.isLoggedIn()) {
      router.replace("/admin/login");
    } else {
      setReady(true);
    }
  }, [isLogin, router]);

  if (isLogin) return <div className="min-h-screen bg-sand">{children}</div>;
  if (!ready) return null;

  return (
    <div className="min-h-screen bg-sand">
      <header className="border-b border-ink/10 bg-white/40">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <Link href="/admin" className="font-[family-name:var(--font-display)] text-xl">
            Modora Élan · Admin
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/admin" className="hover:text-clay">Products</Link>
            <Link href="/admin/categories" className="hover:text-clay">Categories</Link>
            <button
              onClick={() => { auth.clear(); router.replace("/admin/login"); }}
              className="text-ink/50 hover:text-ink"
            >
              Logout
            </button>
          </nav>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
    </div>
  );
}
