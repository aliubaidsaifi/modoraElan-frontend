import { api } from "@/lib/api";
import ProductGrid from "@/components/product/ProductGrid";
import Link from "next/link";
import Image from "next/image";

export default async function Home() {
  const [featuredData, catData] = await Promise.all([
    api.getProducts("?featured=true"),
    api.getCategories(),
  ]);
  const products = featuredData?.products || [];
  const categories = (catData?.categories || []).filter((c) => !c.parent); // top-level only
  const heroImage = products[0]?.images?.[0] || null;

  return (
    <div>
      {/* HERO */}
      <section className="grid md:grid-cols-2 border-b border-ink/10">
        <div className="flex flex-col justify-center px-6 md:px-14 py-20">
          <p className="uppercase tracking-[0.35em] text-xs text-clay mb-6">
            Modest wear · Made in Delhi
          </p>
          <h1 className="font-[family-name:var(--font-display)] text-5xl md:text-7xl leading-[1.02]">
            Grace in every drape.
          </h1>
          <p className="mt-6 text-ink/60 max-w-md text-lg">
            Thoughtfully crafted abayas and modest essentials — designed for the
            everyday and the extraordinary.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <Link href="/category/abayas"
              className="px-8 py-4 bg-ink text-sand text-sm tracking-wide hover:bg-clay transition-colors">
              Shop the Collection
            </Link>
            <Link href="#story"
              className="px-8 py-4 border border-ink/20 text-sm tracking-wide hover:border-ink transition-colors">
              Our Story
            </Link>
          </div>
        </div>
       <div className="relative min-h-[55vh] md:min-h-[80vh]">
  <img src="/hero-light.svg" alt="Modora Élan" className="absolute inset-0 w-full h-full object-cover" />
</div>
      </section>

      {/* VALUE STRIP */}
      <section className="border-b border-ink/10">
        <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 md:divide-x divide-ink/10 text-center">
          {[
            ["Crafted in Delhi", "Made with care"],
            ["Cash on Delivery", "Pay when it arrives"],
            ["Easy 7-day returns", "Shop with confidence"],
            ["Free shipping", "On orders over ₹1499"],
          ].map(([t, s]) => (
            <div key={t} className="py-8 px-4">
              <p className="text-sm font-medium">{t}</p>
              <p className="text-xs text-ink/50 mt-1">{s}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      {categories.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-20">
          <h2 className="font-[family-name:var(--font-display)] text-3xl mb-10">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {categories.map((c) => (
              <Link key={c._id} href={`/category/${c.slug}`}
                className="group relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-sand to-clay/30 flex items-end p-6 border border-ink/10 hover:border-ink/30 transition-colors">
                <span className="font-[family-name:var(--font-display)] text-3xl group-hover:text-clay transition-colors">
                  {c.name}
                </span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* FEATURED */}
      <section className="max-w-6xl mx-auto px-6 py-20 border-t border-ink/10">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-[family-name:var(--font-display)] text-3xl">Featured</h2>
          <Link href="/category/abayas" className="text-sm text-clay hover:underline">
            View all →
          </Link>
        </div>
        {products.length === 0 ? (
          <p className="text-ink/50">
            No featured products yet — mark some as "Featured" in the admin panel.
          </p>
        ) : (
          <ProductGrid products={products} />
        )}
      </section>

      {/* STORY */}
      <section id="story" className="bg-ink text-sand">
        <div className="max-w-3xl mx-auto px-6 py-24 text-center">
          <p className="uppercase tracking-[0.35em] text-xs text-clay mb-6">Our Story</p>
          <h2 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl leading-tight">
            Modesty, reimagined with elegance.
          </h2>
          <p className="mt-8 text-sand/70 leading-relaxed">
            Modora Élan was born in Delhi with a simple belief — that modest clothing
            can be both graceful and contemporary. Each piece is chosen for its quality,
            comfort, and quiet confidence.
          </p>
        </div>
      </section>
    </div>
  );
}