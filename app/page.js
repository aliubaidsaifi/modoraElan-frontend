import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import HeroCarousel from "@/components/home/HeroCarousel";
import Marquee from "@/components/home/Marquee";
import Newsletter from "@/components/home/Newsletter";
import TrendingNow from "@/components/home/TrendingNow";
import { formatPrice } from "@/lib/utils";
const PROMO_MID = "https://res.cloudinary.com/dysfzglxd/image/upload/q_auto/f_auto/v1781637483/ChatGPT_Image_Jun_17_2026_12_33_41_AM_nfxrdp.png";    // wide banner
const PROMO_LEFT = "https://res.cloudinary.com/dysfzglxd/image/upload/q_auto/f_auto/v1781637481/malbus-pak-Ia1sFwLy1rU-unsplash_whtemu.jpg";   // left tall
const PROMO_RIGHT = "https://res.cloudinary.com/dysfzglxd/image/upload/q_auto/f_auto/v1781637483/ChatGPT_Image_Jun_17_2026_12_13_51_AM_qu3rep.png";  // right tall

export default async function Home() {
  const [bannerData, featuredData, newestData, catData] = await Promise.all([
    api.getActiveBanners(),
    api.getProducts("?featured=true"),
    api.getProducts(""),
    api.getCategories(),
  ]);
  const banners = bannerData?.banners || [];
  const featured = featuredData?.products || [];
  const newest = newestData?.products || [];
  const allCats = catData?.categories || [];
  const cats = allCats.filter((c) => c.parent);
  const categoryTiles = (cats.length ? cats : allCats).slice(0, 4);
  const catImage = (id) => newest.find((p) => String(p.category?._id || p.category) === String(id))?.images?.[0] || null;
  const trending = (featured.length ? featured : newest).slice(0, 4);
  const newIn = newest.slice(0, 8);
  const midImg = (featured[0] || newest[0])?.images?.[0] || null;
  const splitA = newest[0]?.images?.[0] || null;
  const splitB = (newest[1]?.images?.[1] || newest[1]?.images?.[0]) || null;

  return (
    <div>
      {/* 1. Full carousel */}
      <HeroCarousel banners={banners} />

      {/* 2. 4 category tiles */}
      <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {categoryTiles.map((c) => (
            <Link key={c._id} href={`/category/${c.slug}`} className="group relative aspect-[3/4] overflow-hidden bg-ink/5">
              {catImage(c._id)
                ? <Image src={catImage(c._id)} alt={c.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" />
                : <div className="absolute inset-0 bg-gradient-to-br from-sand to-clay/40" />}
              <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/30 transition-colors" />
              <div className="absolute inset-x-0 bottom-0 p-4 text-center">
                <span className="text-sand font-[family-name:var(--font-display)] text-2xl capitalize">{c.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Rotating strip */}
      <Marquee items={["New Season Drop", "Crafted in Delhi", "Cash on Delivery", "Easy 7-Day Returns"]} />

      {/* 4. Mid banner image */}
      <section className="relative h-[60vh] min-h-[400px] overflow-hidden my-12">
        <div className="absolute inset-0 bg-gradient-to-br from-ink via-[#3a2e26] to-clay" />
        {PROMO_MID && <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `url('${PROMO_MID}')` }} />}
        <div className="absolute inset-0 bg-ink/40" />
        <div className="relative h-full max-w-7xl mx-auto px-6 flex flex-col items-center justify-center text-center text-sand">
          <p className="uppercase tracking-[0.35em] text-xs mb-3">The Édit</p>
          <h2 className="font-[family-name:var(--font-display)] text-5xl md:text-6xl">Timeless Abayas</h2>
          <Link href="/search" className="mt-6 px-8 py-3.5 bg-sand text-ink hover:bg-clay hover:text-sand transition-colors">Shop the Edit</Link>
        </div>
      </section>

      {/* 5. Trending Now — 4 products (click → product page) */}
        <TrendingNow categories={cats.length ? cats : allCats} />

      {/* 6. 2 side-by-side banners */}
      <section className="grid md:grid-cols-2 gap-3 px-3 my-12">
        {[
          { img: PROMO_LEFT, title: "Occasion Edit", sub: "For the moments that matter", link: "/search" },
          { img: PROMO_RIGHT, title: "Everyday Abayas", sub: "Comfort, reimagined", link: "/search" },
        ].map((b, idx) => (
          <Link key={idx} href={b.link} className="group relative h-[80vh] min-h-[520px] overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-ink to-clay" />
            {b.img && <div className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${b.img}')` }} />}
            <div className="absolute inset-0 bg-ink/30 group-hover:bg-ink/40 transition-colors" />
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center text-sand">
              <p className="uppercase tracking-[0.3em] text-xs mb-2">{b.sub}</p>
              <h3 className="font-[family-name:var(--font-display)] text-4xl md:text-5xl">{b.title}</h3>
              <span className="mt-5 px-6 py-2 border border-sand text-sm hover:bg-sand hover:text-ink transition-colors">Shop Now</span>
            </div>
          </Link>
        ))}
      </section>

      {/* 7. Rotating strip — sale */}
      <Marquee items={["Get 25% Off — Code ELAN25", "New In Every Week"]} dark />

      {/* 8. New In */}
      {newIn.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 md:px-6 py-12">
          <div className="flex items-end justify-between mb-6">
            <h2 className="font-[family-name:var(--font-display)] text-3xl">New In</h2>
            <Link href="/search" className="text-sm text-clay hover:underline">View all →</Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {newIn.map((p) => (
              <Link key={p._id} href={`/products/${p.slug}`} className="group">
                <div className="relative aspect-[3/4] bg-ink/5 overflow-hidden">
                  {p.images?.[0] && <Image src={p.images[0]} alt={p.name} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width:768px) 50vw, 25vw" />}
                  <span className="absolute top-2 left-2 bg-clay text-sand text-[10px] px-2 py-0.5">NEW</span>
                </div>
                <p className="mt-2 text-sm truncate">{p.name}</p>
                <p className="text-sm text-ink/60">{formatPrice(p.price)}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* 9. Newsletter */}
      <Newsletter />
    </div>
  );
}