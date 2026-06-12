import { api } from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const title = slug.charAt(0).toUpperCase() + slug.slice(1);
  return { title, description: `Shop ${title} at Modora.` };
}

export default async function CategoryPage({ params, searchParams }) {
  const { slug } = await params;
  const sp = await searchParams;
  const query = `?category=${slug}${sp?.search ? `&search=${sp.search}` : ""}`;
  const data = await api.getProducts(query);
  const products = data?.products || [];

  return (
    <div className="px-6 py-12 max-w-6xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-4xl mb-2 capitalize">
        {slug}
      </h1>
      <p className="text-ink/50 text-sm mb-10">{products.length} products</p>
      {products.length === 0 ? (
        <p className="text-ink/50">No products in this category yet.</p>
      ) : (
        <ProductGrid products={products} />
      )}
    </div>
  );
}
