import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import Image from "next/image";

import { getBlogPostBySlug, getBlogPosts } from "../../lib/contentful-blog";
import { ArrowLeftIcon } from "lucide-react";

interface BlogPageProps {
  params: {
    id: string;
  };
}

function renderRichText(value?: string | Document) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? (
    <p>{value}</p>
  ) : (
    documentToReactComponents(value)
  );
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export async function generateMetadata({
  params,
}: BlogPageProps): Promise<Metadata> {
  const post = await getBlogPostBySlug(params.id);

  if (!post) {
    return {
      title: "Blog post not found",
    };
  }

  return {
    title: typeof post.title === "string" ? post.title : "Blog post",
    description: post.excerpt,
  };
}

export default async function BlogPostPage({ params }: BlogPageProps) {
  const post = await getBlogPostBySlug(params.id);

  if (!post) {
    notFound();
  }

  return (
    <div className="bg-[var(--surface)]">
      {/* Masthead / back nav */}
      <section className="mx-auto max-w-5xl px-5 pt-16 sm:px-8 lg:px-16">
        <div className="flex items-center justify-between border-b border-[var(--ink)]/10 pb-6">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--green)]"
          >
            <span aria-hidden>
              <ArrowLeftIcon />
            </span>{" "}
            Back to news
          </Link>
          <p className="eyebrow">FUTO Academic Gazette</p>
        </div>
      </section>

      {/* Headline + dateline */}
      <section className="mx-auto max-w-5xl px-5 pb-12 pt-10 sm:px-8 lg:px-16">
        <div className="max-w-3xl">
          <h1 className="font-serif text-4xl font-bold leading-[1.1] sm:text-5xl">
            {renderRichText(post.title)}
          </h1>

          <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 border-t border-[var(--ink)]/10 pt-5 text-sm">
            <span className="font-semibold uppercase tracking-wide text-[var(--ink)]">
              {formatDate(post.datePublished)}
            </span>
            {post.category.length ? (
              <>
                <span className="text-[var(--ink)]/20">|</span>
                <span className="flex flex-wrap gap-2">
                  {post.category.map((cat) => (
                    <span
                      key={cat}
                      className="font-semibold uppercase tracking-wide text-[var(--green)]"
                    >
                      {cat}
                    </span>
                  ))}
                </span>
              </>
            ) : null}
          </div>
        </div>
      </section>

      {/* Cover image, full bleed within container */}
      {post.coverImage ? (
        <section className="mx-auto max-w-6xl px-5 sm:px-8 lg:px-16">
          <div className="overflow-hidden">
            <Image
              src={post.coverImage}
              alt={
                typeof post.title === "string" ? post.title : "Blog cover image"
              }
              className="h-auto w-full object-cover"
              width={800}
              height={260}
              priority
            />
          </div>
        </section>
      ) : null}

      {/* Body copy */}
      <section className="mx-auto max-w-5xl px-5 py-16 sm:px-8 lg:px-16">
        <div
          className="prose prose-lg mx-auto max-w-3xl text-[var(--ink)]
            prose-headings:font-serif prose-headings:font-bold
            prose-p:leading-8 prose-p:text-[var(--ink)]/90
            prose-a:text-[var(--green)] prose-a:no-underline hover:prose-a:underline
            prose-img:rounded-none
            first:prose-p:first-letter:float-left first:prose-p:first-letter:mr-2
            first:prose-p:first-letter:font-serif first:prose-p:first-letter:text-6xl
            first:prose-p:first-letter:font-bold first:prose-p:first-letter:leading-[0.85]
            first:prose-p:first-letter:text-[var(--green)]"
        >
          {renderRichText(post.body)}
        </div>

        <div className="mx-auto mt-16 max-w-3xl border-t border-[var(--ink)]/10 pt-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--ink)] transition-colors hover:text-[var(--green)]"
          >
            <span aria-hidden>←</span> Back to all news
          </Link>
        </div>
      </section>
    </div>
  );
}

// Enable ISR for this dynamic blog post page (revalidate every 60 seconds)
export const revalidate = 60;

// Pre-render known blog slugs at build time
export async function generateStaticParams() {
  const posts = await getBlogPosts();
  return posts.map((p) => ({ id: p.slug }));
}
