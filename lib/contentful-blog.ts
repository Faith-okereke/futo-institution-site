import { BlogPost, BlogPostEntry, Category } from "../app/types/content";
import { fallbackBlogPosts } from "./blog-content";
import { contentfulClient } from "./contentful";

function getAssetUrl(item: BlogPostEntry): string | null {
  const url = item.fields.coverImage?.fields?.file?.url;

  return url ? `https:${url}` : null;
}

function mapBlogPost(item: BlogPostEntry): BlogPost {
  return {
    title: item.fields.title ?? "",
    slug: item.fields.slug ?? "",
    category: mapCategories(item.fields.category),
    excerpt: item.fields.excerpt ?? "",
    body: item.fields.body ?? "",
    datePublished: item.fields.datePublished ?? "",
    featured: item.fields.featured ?? false,
    coverImage: getAssetUrl(item),
  };
}

const allowedCategories: Category[] = [
  "Research",
  "Academics",
  "Admissions",
  "Campus Life",
  "Innovation",
  "Events",
  "Announcements",
];

const isProductionBuild = process.env.NEXT_PHASE === "phase-production-build";

function mapCategories(input?: string[]): Category[] {
  if (!input) return [];
  return input.filter((c): c is Category => allowedCategories.includes(c as Category));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!contentfulClient || isProductionBuild) {
    return fallbackBlogPosts;
  }

  try {
    const entries = await contentfulClient.getEntries({
      content_type: "blogPost",
      order: ["-fields.datePublished"],
    });

    return (entries.items as unknown as BlogPostEntry[]).map(mapBlogPost);
  } catch {
    console.warn("Using fallback blog posts because Contentful failed.");
    return fallbackBlogPosts;
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const fallbackPost = fallbackBlogPosts.find((post) => post.slug === slug) ?? null;

  if (!contentfulClient || isProductionBuild) {
    return fallbackPost;
  }

  try {
    const entries = await contentfulClient.getEntries({
      content_type: "blogPost",
      "fields.slug": slug,
      limit: 1,
    });

    const [entry] = entries.items as unknown as BlogPostEntry[];

    return entry ? mapBlogPost(entry) : fallbackPost;
  } catch {
    console.warn("Using fallback blog post because Contentful failed.");
    return fallbackPost;
  }
}
