"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { userAuth } from "@/lib/userAuth";
import { formatPrice, formatDate } from "@/lib/utils";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
const NAV = [{ key: "overview", label: "Overview" }, { key: "orders", label: "My Orders" }, { key: "profile", label: "Profile" }];
const STEPS = [
  { key: "pending", label: "Placed" },
  { key: "confirmed", label: "Confirmed" },
  { key: "packed", label: "Packed" },
  { key: "shipped", label: "Out for delivery" },
  { key: "delivered", label: "Delivered" },
];

function Tracker({ status }) {
  if (["cancelled", "returned", "refunded"].includes(status))
    return <p className="text-sm text-red-700 capitalize">This order was {status}.</p>;
  const current = STEPS.findIndex((s) => s.key === status);
  return (
    <div className="flex items-start">
      {STEPS.map((step, i) => (
        <div key={step.key} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center">
            <div className={`w-3.5 h-3.5 rounded-full ${i <= current ? "bg-ink" : "bg-ink/20"}`} />
            <span className={`text-[10px] mt-1.5 whitespace-nowrap ${i <= current ? "text-ink" : "text-ink/40"}`}>{step.label}</span>
          </div>
          {i < STEPS.length - 1 && (
            <div className={`flex-1 h-0.5 mx-1 mb-4 ${i < current ? "bg-ink" : "bg-ink/15"}`} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function AccountPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [tab, setTab] = useState("overview");
  const [orders, setOrders] = useState([]);
  const [ordersLoaded, setOrdersLoaded] = useState(false);
  const [expanded, setExpanded] = useState(null);

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
          <button onClick={logout} className="text-left px-3 py-2 text-sm text-ink/50 hover:text-ink md:mt-2">Log out</button>
        </nav>
      </aside>

      <section className="min-h-[40vh]">
        {tab === "overview" && (
          <div>
            <h1 className="font-[family-name:var(--font-display)] text-4xl mb-4">Hello, {user.name.split(" ")[0]}</h1>
            <p className="text-ink/60 max-w-md">Welcome to your Modora Élan account. Track your orders, manage your details, and check out faster.</p>
            <div className="grid grid-cols-2 gap-4 mt-8 max-w-md">
              <button onClick={() => setTab("orders")} className="border border-ink/15 p-5 text-left hover:border-ink/40 transition-colors">
                <p className="font-[family-name:var(--font-display)] text-2xl">Orders</p>
                <p className="text-sm text-ink/50 mt-1">View your order history</p>
              </button>
              <Link href="/category/abayas" className="border border-ink/15 p-5 text-left hover:border-ink/40 transition-colors">
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
                <Link href="/category/abayas" className="text-clay hover:underline mt-2 inline-block">Start shopping →</Link>
              </div>
            ) : (
              <div className="space-y-3">
                {orders.map((o) => {
                  const open = expanded === o._id;
                  return (
                    <div key={o._id} className="border border-ink/10">
                      <button onClick={() => setExpanded(open ? null : o._id)}
                        className="w-full flex justify-between items-center p-4 text-left hover:bg-ink/5 transition-colors">
                        <div>
                          <p className="text-sm text-ink/50">#{o._id.slice(-6).toUpperCase()} · {formatDate(o.createdAt)}</p>
                          <span className="capitalize text-xs px-2 py-0.5 bg-ink/5 inline-block mt-1">{o.status}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-[family-name:var(--font-display)] text-xl">{formatPrice(o.total)}</span>
                          <span className="text-ink/40 text-sm">{open ? "▲" : "▼"}</span>
                        </div>
                      </button>

                      {open && (
                        <div className="border-t border-ink/10 p-4 space-y-6">
                          <Tracker status={o.status} />

                          <div className="space-y-3">
                            {o.items.map((it, idx) => (
                              <div key={idx} className="flex gap-3">
                                <div className="relative w-14 h-18 bg-ink/5 shrink-0">
                                  {it.image && <Image src={it.image} alt={it.name} fill className="object-cover" sizes="56px" />}
                                </div>
                                <div className="text-sm">
                                  <p>{it.name}</p>
                                  <p className="text-ink/50">Size {it.size} · Qty {it.quantity} · {formatPrice(it.price)}</p>
                                  {it.measurements && (
                                    <p className="text-xs text-ink/50 mt-0.5">
                                      {Object.entries(it.measurements).map(([k, v]) => `${k}: ${v}"`).join(" · ")}
                                    </p>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>

                          {o.shippingAddress?.line1 && (
                            <div className="text-sm text-ink/60 border-t border-ink/10 pt-3">
                              <p className="text-xs uppercase tracking-widest text-ink/40 mb-1">Delivery to</p>
                              {o.shippingAddress.fullName}, {o.shippingAddress.phone}<br />
                              {o.shippingAddress.line1}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.pincode}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
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