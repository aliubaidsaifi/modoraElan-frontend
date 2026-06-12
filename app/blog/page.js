import { api } from "@/lib/api";
import Link from "next/link";
import Image from "next/image";
import { formatDate } from "@/lib/utils";

export const metadata = { title: "Journal", description: "Stories, styling and modest fashion notes from Modora." };

export default async function BlogPage() {
  const data = await api.getPosts();
  const posts = data?.posts || [];

  return (
    <div className="px-6 py-12 max-w-5xl mx-auto">
      <h1 className="font-[family-name:var(--font-display)] text-4xl mb-10">Journal</h1>
      {posts.length === 0 ? (
        <p className="text-ink/50">
          No posts yet. Add Blogger credentials to the backend, then write a post on Blogger.
        </p>
      ) : (
        <div className="grid md:grid-cols-2 gap-10">
          {posts.map((post) => (
            <Link key={post.id} href={`/blog/${post.id}`} className="group block">
              {post.image && (
                <div className="relative aspect-[16/10] overflow-hidden bg-ink/5 mb-4">
                  <Image src={post.image} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="50vw" />
                </div>
              )}
              <p className="text-xs text-ink/40 mb-1">{formatDate(post.publishedAt)}</p>
              <h2 className="font-[family-name:var(--font-display)] text-2xl group-hover:text-clay transition-colors">{post.title}</h2>
              <p className="text-ink/60 text-sm mt-2">{post.excerpt}</p>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
