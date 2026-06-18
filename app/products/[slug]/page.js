import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/layout/product/ProductDetail";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await api.getProduct(slug);
  if (!data?.product) return { title: "Product not found" };
  const p = data.product;
  return {
    title: p.name,
    description: p.description?.slice(0, 160),
    openGraph: { title: p.name, images: p.images?.[0] ? [p.images[0]] : [] },
  };
}

export default async function ProductPage({ params }) {
  const { slug } = await params;
  const data = await api.getProduct(slug);
  if (!data?.product) notFound();
  return <ProductDetail product={data.product} />;
}
