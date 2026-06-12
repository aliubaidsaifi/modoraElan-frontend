"use client";
import ProductForm from "@/components/admin/ProductForm";

export default function NewProduct() {
  return (
    <div>
      <h1 className="font-[family-name:var(--font-display)] text-3xl mb-8">Add Product</h1>
      <ProductForm />
    </div>
  );
}
