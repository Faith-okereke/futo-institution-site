import { news } from "../data/site";
import { getBlogPosts } from "../lib/contentful-blog";

export default async function BlogPage() {
  const posts = await getBlogPosts();
  console.log(posts)
  return (
    <div className="bg-[var(--surface)]">
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8 lg:px-16">
        <p className="eyebrow">FUTO Academic Gazette</p>
        <h1 className="mt-4 max-w-4xl font-serif text-5xl font-bold leading-tight">
          News, research notes, and campus updates.
        </h1>
        <p className="mt-6 max-w-3xl text-lg leading-8 text-[var(--muted)]">
          Follow institutional announcements and stories from the classrooms,
          studios, laboratories, and communities connected to FUTO.
        </p>
      </section>
      <section className="mx-auto grid max-w-7xl gap-5 px-5 pb-20 sm:px-8 lg:px-16">
        {news.map((item) => (
          <article className="news-card" key={item.title}>
            <div>
              <p className="tag">{item.category}</p>
              <h2>{item.title}</h2>
              <p>{item.excerpt}</p>
            </div>
            <time>{item.date}</time>
          </article>
        ))}
      </section>
    </div>
  );
}
