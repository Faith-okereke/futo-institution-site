import { BlogPost, BlogPostEntry, Category } from "../types/content";
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

function mapCategories(input?: string[]): Category[] {
  if (!input) return [];
  return input.filter((c): c is Category => allowedCategories.includes(c as Category));
}

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await contentfulClient.getEntries({
    content_type: "blogPost",
    order: ["-fields.datePublished"],
  });

  return (entries.items as unknown as BlogPostEntry[]).map(mapBlogPost);
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  const entries = await contentfulClient.getEntries({
    content_type: "blogPost",
    "fields.slug": slug,
    limit: 1,
  });

  const [entry] = entries.items as unknown as BlogPostEntry[];

  return entry ? mapBlogPost(entry) : null;
}
