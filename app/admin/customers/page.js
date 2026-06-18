"use client";
import { useEffect, useState } from "react";
import { adminApi } from "@/lib/adminApi";
import { formatPrice, formatDate } from "@/lib/utils";

export default function AdminCustomers() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getCustomers().then((d) => setCustomers(d.customers || [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-6">Customers</h1>
      {loading ? <p className="text-ink/50">Loading...</p> : customers.length === 0 ? (
        <p className="text-ink/50">No customers yet.</p>
      ) : (
        <div className="border border-ink/10 bg-white/50 divide-y divide-ink/10">
          {customers.map((c) => (
            <div key={c._id} className="flex items-center justify-between gap-4 p-4 text-sm">
              <div>
                <p className="font-medium">{c.name}</p>
                <p className="text-ink/50 text-xs">{c.email}{c.phone ? ` · ${c.phone}` : ""}</p>
              </div>
              <div className="text-right">
                <p>{c.orderCount} order{c.orderCount === 1 ? "" : "s"}</p>
                <p className="text-xs text-ink/50">{formatPrice(c.totalSpent || 0)} · since {formatDate(c.createdAt)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}