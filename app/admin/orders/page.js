"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { formatPrice, formatDate } from "@/lib/utils";

const STATUSES = ["pending", "confirmed", "packed", "shipped", "delivered", "cancelled", "returned", "refunded"];

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    try {
      const q = `?status=${statusFilter}${search ? `&search=${encodeURIComponent(search)}` : ""}`;
      const { orders } = await adminApi.getOrders(q);
      setOrders(orders || []);
    } catch {} finally { setLoading(false); }
  };
  useEffect(() => { load(); /* eslint-disable-next-line */ }, [statusFilter]);

  const changeStatus = async (id, status) => {
    await adminApi.updateOrderStatus(id, status);
    setOrders((o) => o.map((x) => (x._id === id ? { ...x, status } : x)));
  };

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">Orders</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-ink/20 px-3 py-2 bg-white/60 text-sm">
          <option value="all">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s} className="capitalize">{s}</option>)}
        </select>
        <input value={search} onChange={(e) => setSearch(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && load()}
          placeholder="Search name / phone, Enter"
          className="border border-ink/20 px-3 py-2 bg-white/60 text-sm flex-1 min-w-48" />
        <button onClick={load} className="px-4 py-2 bg-ink text-sand text-sm">Search</button>
      </div>

      {loading ? (
        <p className="text-ink/50">Loading...</p>
      ) : orders.length === 0 ? (
        <p className="text-ink/50">No orders found.</p>
      ) : (
        <div className="space-y-4">
          {orders.map((o) => (
            <div key={o._id} className="border border-ink/10 bg-white/50 p-4">
              <div className="flex flex-wrap justify-between gap-3 items-start">
                <div>
                  <p className="text-sm text-ink/50">#{o._id.slice(-6).toUpperCase()} · {formatDate(o.createdAt)}</p>
                  <p className="font-medium mt-1">
                    {o.shippingAddress?.fullName || "—"} · {o.shippingAddress?.phone || "—"}
                    <span className="ml-2 text-xs px-2 py-0.5 bg-clay/20 text-clay capitalize">
                      {o.paymentMethod || "COD"}
                    </span>
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-[family-name:var(--font-display)] text-xl">{formatPrice(o.total)}</span>
                  <select value={o.status} onChange={(e) => changeStatus(o._id, e.target.value)}
                    className="border border-ink/20 px-2 py-1 bg-white text-sm capitalize">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              <div className="mt-3 border-t border-ink/10 pt-3 space-y-1">
                {o.items.map((it, idx) => (
                  <div key={idx} className="text-sm">
                    {it.name} <span className="text-ink/50">({it.size}) ×{it.quantity}</span>
                    {it.measurements && (
                      <span className="text-xs text-ink/50 block ml-2">
                        ↳ {Object.entries(it.measurements).map(([k, v]) => `${k}: ${v}"`).join(" · ")}
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {o.shippingAddress?.line1 && (
                <p className="text-xs text-ink/50 mt-3">
                  📍 {o.shippingAddress.line1}, {o.shippingAddress.city}, {o.shippingAddress.state} {o.shippingAddress.pincode}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}