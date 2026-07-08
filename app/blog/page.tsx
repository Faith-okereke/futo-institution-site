import Image from "next/image";
// import { news } from "../data/site";
import { documentToReactComponents } from "@contentful/rich-text-react-renderer";
import type { Document } from "@contentful/rich-text-types";
import Link from "next/link";
import { getBlogPosts } from "../../lib/contentful-blog";

function renderRichText(value?: string | Document) {
  if (!value) {
    return null;
  }

  return typeof value === "string" ? value : documentToReactComponents(value);
}

function formatDate(date: string) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function issueNumber(index: number) {
  return String(index + 1).padStart(2, "0");
}

export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getBlogPosts();
  const [featured, ...rest] = posts;

  return (
    <div className="bg-[var(--surface)]">
      {/* Masthead */}
      <section className="mx-auto max-w-7xl px-5 pt-20 sm:px-8 lg:px-16">
        <div className="flex flex-wrap items-baseline justify-between gap-4 border-b border-[var(--ink)]/10 pb-8">
          <div>
            <p className="eyebrow">FUTO Academic Gazette</p>
            <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight">
              News, research notes, and campus updates.
            </h1>
          </div>
          <p className="text-sm font-semibold uppercase tracking-wide text-[var(--muted)]">
            {posts.length
              ? `${posts.length} ${posts.length === 1 ? "entry" : "entries"} on record`
              : null}
          </p>
        </div>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Follow institutional announcements and stories from the classrooms,
          studios, laboratories, and communities connected to FUTO.
        </p>
      </section>

      {posts.length === 0 ? (
        <section className="mx-auto max-w-7xl px-5 py-24 sm:px-8 lg:px-16">
          <p className="border-t border-[var(--ink)]/10 pt-8 text-[var(--muted)]">
            No entries have been published yet. Check back soon.
          </p>
        </section>
      ) : (
        <>
          {/* Featured lead story */}
          <section className="mx-auto max-w-7xl px-5 pt-16 sm:px-8 lg:px-16">
            <Link
              href={`/blog/${featured.slug}`}
              className="group grid gap-8 border-b border-[var(--ink)]/10 pb-16 lg:grid-cols-2 lg:items-center"
            >
              {featured.coverImage ? (
                <div className="overflow-hidden">
                  <Image
                    src={featured.coverImage}
                    alt={
                      typeof featured.title === "string"
                        ? featured.title
                        : "Featured story cover image"
                    }
                    width={800}
                    height={520}
                    className="h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                  />
                </div>
              ) : (
                <div className="aspect-[8/5.2] bg-[var(--ink)]/5" />
              )}
              <div>
                <div className="flex flex-wrap gap-2">
                  {featured.category.map((cat) => (
                    <p key={cat} className="tag">
                      {cat}
                    </p>
                  ))}
                </div>
                <h2 className="mt-4 font-serif text-3xl font-bold leading-tight text-[var(--ink)] sm:text-4xl">
                  <span className="bg-[linear-gradient(var(--green),var(--green))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
                    {renderRichText(featured.title)}
                  </span>
                </h2>
                <div className="prose prose-sm mt-4 max-w-none text-base text-[var(--muted)]">
                  {featured.excerpt}
                </div>
                <div className="mt-6 flex items-center gap-3 text-sm font-semibold text-[var(--muted)]">
                  <span>{formatDate(featured.datePublished)}</span>
                  <span className="text-[var(--ink)]/20">—</span>
                  <span className="text-[var(--green)]">Read the full story</span>
                </div>
              </div>
            </Link>
          </section>

          {/* Remaining entries */}
          {rest.length > 0 ? (
            <section className="mx-auto max-w-7xl px-5 py-16 sm:px-8 lg:px-16">
              <div className="grid gap-x-10 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
                {rest.map((item, i) => (
                  <Link
                    href={`/blog/${item.slug}`}
                    key={item.slug}
                    className="group flex flex-col border-t border-[var(--ink)]/10 pt-6"
                  >
                    <div className="flex items-baseline justify-between">
                      <span className="font-serif text-sm text-[var(--muted)]">
                        No. {issueNumber(i)}
                      </span>
                      <div className="flex flex-wrap justify-end gap-2">
                        {item.category.map((cat) => (
                          <p key={cat} className="tag">
                            {cat}
                          </p>
                        ))}
                      </div>
                    </div>

                    {item.coverImage ? (
                      <div className="mt-4 overflow-hidden">
                        <Image
                          src={item.coverImage}
                          alt={
                            typeof item.title === "string"
                              ? item.title
                              : "Blog cover image"
                          }
                          width={400}
                          height={230}
                          className="h-48 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.04]"
                        />
                      </div>
                    ) : null}

                    <h3 className="mt-4 font-serif text-xl font-semibold leading-snug text-[var(--ink)]">
                      <span className="bg-[linear-gradient(var(--green),var(--green))] bg-[length:0%_1px] bg-left-bottom bg-no-repeat transition-[background-size] duration-300 ease-out group-hover:bg-[length:100%_1px]">
                        {renderRichText(item.title)}
                      </span>
                    </h3>

                    <div className="prose prose-sm mt-2 flex-1 text-[var(--muted)]">
                      {item.excerpt}
                    </div>

                    <div className="mt-4 text-sm font-semibold text-[var(--muted)]">
                      {formatDate(item.datePublished)}
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          ) : null}
        </>
      )}
    </div>
  );
}