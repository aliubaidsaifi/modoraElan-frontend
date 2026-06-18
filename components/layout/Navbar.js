"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { api } from "@/lib/api";
import { userAuth } from "@/lib/userAuth";
import { auth } from "@/lib/auth";
import SearchBar from "./SearchBar";

function Icon({ children }) {
  return <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">{children}</svg>;
}

export default function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => { api.getCategories().then((d) => setCategories(d?.categories || [])).catch(() => {}); }, []);
  useEffect(() => { setUser(userAuth.isLoggedIn() ? userAuth.getUser() : null); }, [pathname]);

  const childrenOf = (id) => categories.filter((c) => String(c.parent) === String(id));
  const womenCat = categories.find((c) => !c.parent && (c.slug === "women" || c.name?.toLowerCase() === "women"));
  const womenHref = womenCat ? `/category/${womenCat.slug}` : "/search";
  const womenColumns = womenCat ? childrenOf(womenCat._id) : categories.filter((c) => !c.parent);
  const firstName = user?.name?.split(" ")[0];
  const logout = () => { userAuth.clear(); auth.clear(); setUser(null); router.push("/"); };
  const topItem = "text-sm font-semibold tracking-wide hover:text-clay transition-colors h-16 flex items-center";

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-ink/10">
      <nav className="max-w-7xl mx-auto px-6 h-16 flex items-center gap-6">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <img src="/logo-me-badge.svg" alt="Modora Élan" className="h-9 w-9" />
          <span className="font-[family-name:var(--font-display)] text-xl tracking-wide hidden sm:block">Modora Élan</span>
        </Link>

        {/* Top categories */}
        <div className="hidden lg:flex items-stretch gap-7">
          {/* WOMEN + mega-menu */}
          <div className="group flex items-stretch">
            <Link href={womenHref} className={topItem}>WOMEN</Link>
            <div className="fixed top-16 left-0 right-0 hidden group-hover:block z-40">
              <div className="bg-white border-t border-ink/10 shadow-lg">
                <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-4 gap-8">
                  {womenColumns.length === 0 ? (
                    <div className="text-sm text-ink/40">Admin → Categories me categories add karo, yahan dikhengi.</div>
                  ) : womenColumns.map((col) => (
                    <div key={col._id}>
                      <Link href={`/category/${col.slug}`} className="text-clay font-semibold text-sm capitalize">{col.name}</Link>
                      <ul className="mt-3 space-y-2">
                        <li><Link href={`/category/${col.slug}`} className="text-sm text-ink/70 hover:text-clay">All {col.name}</Link></li>
                        {childrenOf(col._id).map((sub) => (
                          <li key={sub._id}><Link href={`/category/${sub.slug}`} className="text-sm text-ink/70 hover:text-clay capitalize">{sub.name}</Link></li>
                        ))}
                      </ul>
                    </div>
                  ))}
                  <div>
                    <p className="text-clay font-semibold text-sm">Shop By</p>
                    <ul className="mt-3 space-y-2 text-sm text-ink/70">
                      <li><Link href="/search" className="hover:text-clay">All Products</Link></li>
                      <li><Link href="/search" className="hover:text-clay">New Arrivals</Link></li>
                      <li><Link href="/search" className="hover:text-clay">Best Sellers</Link></li>
                      <li><Link href="/search?inStock=true" className="hover:text-clay">In Stock</Link></li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* KIDS — coming soon */}
          <Link href="/kids" className={topItem}>
            KIDS <span className="ml-1 text-[9px] text-clay font-bold align-top">SOON</span>
          </Link>
        </div>

        {/* Search */}
        <div className="flex-1 max-w-2xl"><SearchBar /></div>

        {/* Right icons */}
        <div className="flex items-center gap-5 shrink-0">
          {/* Profile */}
          <div className="relative group">
            <button className="flex flex-col items-center text-[11px] font-medium hover:text-clay">
              <Icon><circle cx="12" cy="8" r="4" /><path d="M4 21c0-4 3.5-6 8-6s8 2 8 6" /></Icon>
              <span className="mt-0.5">Profile</span>
            </button>
            <div className="absolute right-0 top-full hidden group-hover:block z-40">
              <div className="bg-white border border-ink/10 shadow-lg min-w-56 py-2">
                {user ? (
                  <>
                    <p className="px-4 py-2 text-sm border-b border-ink/10 mb-1">Hi, <span className="font-medium">{firstName}</span></p>
                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-ink/5 hover:text-clay">My Account</Link>
                    <Link href="/account" className="block px-4 py-2 text-sm hover:bg-ink/5 hover:text-clay">My Orders</Link>
                    <Link href="/wishlist" className="block px-4 py-2 text-sm hover:bg-ink/5 hover:text-clay">Wishlist</Link>
                    {user.role === "admin" && <Link href="/admin" className="block px-4 py-2 text-sm text-clay font-medium hover:bg-ink/5">Admin Dashboard</Link>}
                    <button onClick={logout} className="block w-full text-left px-4 py-2 text-sm text-ink/60 hover:bg-ink/5 hover:text-ink border-t border-ink/10 mt-1">Sign Out</button>
                  </>
                ) : (
                  <div className="px-4 py-3 w-56">
                    <p className="text-sm font-medium">Welcome</p>
                    <p className="text-xs text-ink/50 mb-3">To access orders &amp; wishlist</p>
                    <Link href="/login" className="block text-center py-2 bg-ink text-sand text-sm hover:bg-clay transition-colors">Login</Link>
                    <p className="text-xs text-center mt-2 text-ink/60">New? <Link href="/register" className="text-clay hover:underline">Sign up</Link></p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Wishlist */}
          <Link href="/wishlist" className="flex flex-col items-center text-[11px] font-medium hover:text-clay">
            <Icon><path d="M12 21s-7-4.5-9.5-9A5 5 0 0 1 12 6a5 5 0 0 1 9.5 6c-2.5 4.5-9.5 9-9.5 9z" /></Icon>
            <span className="mt-0.5">Wishlist</span>
          </Link>

          {/* Bag */}
          <Link href="/cart" className="relative flex flex-col items-center text-[11px] font-medium hover:text-clay">
            <Icon><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z" /><path d="M3 6h18" /><path d="M16 10a4 4 0 0 1-8 0" /></Icon>
            <span className="mt-0.5">Bag</span>
            {count > 0 && <span className="absolute top-0 right-1 bg-clay text-sand text-[9px] w-4 h-4 rounded-full flex items-center justify-center">{count}</span>}
          </Link>
        </div>
      </nav>
    </header>
  );
}