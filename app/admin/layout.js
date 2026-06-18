"use client";
import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { userAuth } from "@/lib/userAuth";

const NAV = [
  { label: "Dashboard", icon: "🏠", href: "/admin" },
  { group: "Catalog", items: [
    { label: "Products", icon: "📦", href: "/admin/products" },
    { label: "Categories", icon: "🗂️", href: "/admin/categories" },
  ]},
  { group: "Sales", items: [
    { label: "Orders", icon: "🛒", href: "/admin/orders" },
    { label: "Customers", icon: "👥", href: "/admin/customers" },
  ]},
  { group: "Content", items: [
    { label: "Banners", icon: "🖼️", href: "/admin/banners" },
  ]},
];
const SOON = ["🎯 Marketing", "📈 Analytics", "🚚 Shipping", "⚙️ Settings"];

export default function AdminLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    if (!auth.isLoggedIn()) router.replace("/login");
    else { setReady(true); setAdmin(auth.getUser()); }
  }, [router]);

  if (!ready) return null;

  const active = (href) => (href === "/admin" ? pathname === "/admin" : pathname.startsWith(href));
  const link = (item) => (
    <Link key={item.href} href={item.href}
      className={`flex items-center gap-2.5 px-3 py-2 text-sm rounded transition-colors ${active(item.href) ? "bg-ink text-sand" : "hover:bg-ink/5 text-ink/80"}`}>
      <span>{item.icon}</span> {item.label}
    </Link>
  );

  return (
    <div className="min-h-screen bg-sand flex flex-col md:flex-row">
      <aside className="md:w-60 md:min-h-screen border-b md:border-b-0 md:border-r border-ink/10 bg-white/40 p-4 shrink-0">
        <Link href="/admin" className="block mb-6 px-1">
          <span className="font-[family-name:var(--font-display)] text-xl">Modora Élan</span>
          <span className="block text-[10px] uppercase tracking-[0.3em] text-clay">Admin</span>
        </Link>
        <nav className="space-y-1">
          {NAV.map((n, i) =>
            n.group ? (
              <div key={i} className="pt-3">
                <p className="px-3 text-[10px] uppercase tracking-widest text-ink/35 mb-1">{n.group}</p>
                {n.items.map(link)}
              </div>
            ) : link(n)
          )}
          <div className="pt-4">
            <p className="px-3 text-[10px] uppercase tracking-widest text-ink/35 mb-1">Coming soon</p>
            {SOON.map((s) => (
              <span key={s} className="flex items-center gap-2.5 px-3 py-2 text-sm text-ink/30 cursor-not-allowed">{s}</span>
            ))}
          </div>
        </nav>
      </aside>

      <div className="flex-1 flex flex-col">
        <header className="border-b border-ink/10 bg-white/40 h-14 flex items-center justify-between px-6">
          <input placeholder="Search..." className="bg-transparent border border-ink/15 px-3 py-1.5 text-sm outline-none focus:border-ink w-40 md:w-64" />
          <div className="flex items-center gap-4 text-sm">
            <Link href="/" className="text-ink/60 hover:text-ink">View Store ↗</Link>
            <span className="text-ink/70">👤 {admin?.name || "Admin"}</span>
            <button onClick={() => { auth.clear(); userAuth.clear(); router.replace("/login"); }}
              className="text-ink/50 hover:text-ink">Logout</button>
          </div>
        </header>
        <main className="flex-1 p-6 max-w-6xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}