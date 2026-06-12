"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { userAuth } from "@/lib/userAuth";
import { formatPrice, formatDate } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

const NAV = [
  { key: "overview", label: "Overview" },
  { key: "orders", label: "My Orders" },
  { key: "profile", label: "Profile" },
];

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);

  useEffect(() => {
    if (!userAuth.isLoggedIn()) { router.replace("/login"); return; }
    setUser(userAuth.getUser());
  }, [router]);

  useEffect(() => {
    if (tab !== "orders" || ordersLoaded) return;
    const token = userAuth.getToken();
    fetch(`${API}/orders/my`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => (r.ok ? r.json() : { orders: [] }))
      .then((d) => setOrders(d.orders || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoaded(true));
  }, [tab, ordersLoaded]);

  if (!user) return null;
  const logout = () => { userAuth.clear(); router.replace("/"); };

  return (
    <div className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-[220px_1fr] gap-10">
      {/* Sidebar */}
      <aside>
        <p className="font-[family-name:var(--font-display)] text-2xl mb-1">My Account</p>
        <p className="text-sm text-ink/50 mb-8">{user.name}</p>
        <nav className="flex md:flex-col gap-1">
          {NAV.map((n) => (
            <button key={n.key} onClick={() => setTab(n.key)}
              className={`text-left px-3 py-2 text-sm transition-colors ${tab === n.key ? "bg-ink text-sand" : "hover:bg-ink/5"}`}>
              {n.label}
            </button>
          ))}
          <button onClick={logout}
            className="text-left px-3 py-2 text-sm text-ink/50 hover:text-ink md:mt-2">
            Log out
          </button>
        </nav>
      </aside>

      {/* Content */}
      <section className="min-h-[40vh]">
        {tab === "overview" && (
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl mb-4">
              Hello, {user.name.split(" ")[0]}
            </h1>
            <p className="text-ink/60 max-w-md">
              Welcome to your Modora Élan account. Track your orders, manage your
              details, and check out faster on your next visit.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
              <button onClick={() => setTab("orders")}
                className="border border-ink/15 p-5 text-left hover:border-ink/40 transition-colors">
                <p className="font-[family-name:var(--font-display)] text-2xl">Orders</p>
                <p className="text-sm text-ink/50 mt-1">View your order history</p>
              </button>
              <Link href="/category/abayas"
                className="border border-ink/15 p-5 text-left hover:border-ink/40 transition-colors">
                <p className="font-[family-name:var(--font-display)] text-2xl">Shop</p>
                <p className="text-sm text-ink/50 mt-1">Browse the collection</p>
              </Link>
            </div>
          </div>
        )}

        {tab === "orders" && (
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">My Orders</h1>
            {!ordersLoaded ? (
              <p className="text-ink/50">Loading...</p>
            ) : orders.length === 0 ? (
              <div className="text-ink/50">
                <p>You haven&apos;t placed any orders yet.</p>
                <Link href="/category/abayas" className="text-clay hover:underline mt-2 inline-block">
                  Start shopping →
                </Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => (
                  <div key={o._id} className="border border-ink/10 p-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-ink/50">#{o._id.slice(-6).toUpperCase()}</span>
                      <span className="capitalize px-2 py-0.5 bg-ink/5 text-xs">{o.status}</span>
                    </div>
                    <div className="flex justify-between items-end mt-2">
                      <span className="text-sm text-ink/60">{formatDate(o.createdAt)}</span>
                      <span className="font-[family-name:var(--font-display)] text-xl">{formatPrice(o.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "profile" && (
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">Profile</h1>
            <div className="space-y-4 max-w-md">
              {[["Name", user.name], ["Email", user.email], ["Phone", user.phone || "—"]].map(([l, v]) => (
                <div key={l} className="border-b border-ink/10 pb-3">
                  <p className="text-xs uppercase tracking-widest text-ink/40">{l}</p>
                  <p className="mt-1">{v}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}