import { api } from "@/lib/api";
import { notFound } from "next/navigation";
import { formatDate } from "@/lib/utils";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const data = await api.getPost(slug);
  return { title: data?.post?.title || "Post" };
}

export default async function PostPage({ params }) {
  const { slug } = await params; // here slug = Blogger post id
  const data = await api.getPost(slug);
  if (!data?.post) notFound();
  const { post } = data;

  return (
    <article className="px-6 py-12 max-w-2xl mx-auto">
      <p className="text-xs text-ink/40 mb-2">{formatDate(post.publishedAt)}</p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl mb-8">{post.title}</h1>
      {/* Blogger returns sanitized HTML */}
      <div className="blog-content" dangerouslySetInnerHTML={{ __html: post.content }} />
    </article>
  );
}
