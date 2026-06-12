"use client";
import { useEffect, useState, use } from "react";
import { adminApi } from "@/lib/adminApi";
import ProductForm from "@/components/admin/ProductForm";

export default function EditProduct({ params }) {
  const { slug } = use(params);
  const [product, setProduct] = useState(null);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    adminApi.getProduct(slug)
      .then((d) => setProduct(d.product))
      .catch(() => setNotFound(true));
  }, [slug]);

  if (notFound) return <p className="text-ink/50">Product not found.</p>;
  if (!product) return <p className="text-ink/50">Loading...</p>;

  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">Edit Product</h1>
      <ProductForm initial={product} productId={product._id} />
    </div>
  );
}
