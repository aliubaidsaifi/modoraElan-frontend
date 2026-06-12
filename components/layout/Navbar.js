"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cartStore";
import { api } from "@/lib/api";
import { userAuth } from "@/lib/userAuth";

export default function Navbar() {
  const router = useRouter();
  const count = useCart((s) => s.items.reduce((n, i) => n + i.quantity, 0));
  const [categories, setCategories] = useState([]);
  const [user, setUser] = useState(null);

  useEffect(() => {
    api.getCategories().then((d) => setCategories(d?.categories || [])).catch(() => {});
    if (userAuth.isLoggedIn()) setUser(userAuth.getUser());
  }, []);

  const topLevel = categories.filter((c) => !c.parent);
  const childrenOf = (id) => categories.filter((c) => String(c.parent) === String(id));
  const logout = () => { userAuth.clear(); setUser(null); router.push("/"); };
  const firstName = user?.name?.split(" ")[0];

  return (
    <header className="sticky top-0 z-50 bg-sand/80 backdrop-blur border-b border-ink/10">
      <nav className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5">
  <img src="/logo-me-badge.svg" alt="Modora Élan" className="h-9 w-9" />
  <span className="font-[family-name:var(--font-display)] text-2xl tracking-wide">Modora Élan</span>
</Link>

        <div className="hidden md:flex items-center gap-7 text-sm">
          {topLevel.map((cat) => {
            const subs = childrenOf(cat._id);
            return (
              <div key={cat._id} className="relative group">
                <Link href={`/category/${cat.slug}`} className="hover:text-clay capitalize py-5 inline-block">
                  {cat.name}
                </Link>
                {subs.length > 0 && (
                  <div className="absolute left-0 top-full hidden group-hover:block">
                    <div className="bg-sand border border-ink/10 shadow-sm min-w-44 py-2">
                      {subs.map((sub) => (
                        <Link key={sub._id} href={`/category/${sub.slug}`}
                          className="block px-4 py-2 hover:bg-ink/5 hover:text-clay capitalize">
                          {sub.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          <Link href="/blog" className="hover:text-clay">Journal</Link>
          <Link href="/#story" className="hover:text-clay">About</Link>
        </div>

        <div className="flex items-center gap-5 text-sm">
          {user ? (
            <div className="relative group">
              <button className="hover:text-clay py-5 flex items-center gap-1">
                Hi, {firstName} <span className="text-xs">▾</span>
              </button>
              <div className="absolute right-0 top-full hidden group-hover:block">
                <div className="bg-sand border border-ink/10 shadow-sm min-w-48 py-2">
                  <Link href="/account" className="block px-4 py-2 hover:bg-ink/5 hover:text-clay">My Account</Link>
                  <Link href="/account" className="block px-4 py-2 hover:bg-ink/5 hover:text-clay">My Orders</Link>
                  <Link href="/account" className="block px-4 py-2 hover:bg-ink/5 hover:text-clay">Profile</Link>
                  <button onClick={logout}
                    className="block w-full text-left px-4 py-2 hover:bg-ink/5 text-ink/60 border-t border-ink/10 mt-1">
                    Log out
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <Link href="/login" className="hover:text-clay">Login</Link>
          )}
          <Link href="/cart" className="hover:text-clay">Cart ({count})</Link>
        </div>
      </nav>
    </header>
  );
}