import { news } from "../data/site";
import {
  BlogPost,
  ContentfulRichTextDocument,
  ContentfulRichTextNode,
} from "../types/content";

const fallbackBody =
  "FUTO continues to connect rigorous teaching, practical research, and public service across its academic community. This update reflects the university's commitment to applied technology, student success, and institutional excellence.";

export const fallbackBlogPosts: BlogPost[] = news.map((item) => ({
  title: item.title,
  slug: item.title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, ""),
  category: item.category,
  excerpt: item.excerpt,
  body: `${item.excerpt}\n\n${fallbackBody}`,
  datePublished: item.date,
  featured: item.category === "Research",
  coverImage: item.image,
}));

export function formatBlogDate(value: string): string {
  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat("en", {
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(date);
}

export function getBlogImage(post: BlogPost, index = 0): string {
  const fallback = fallbackBlogPosts[index % fallbackBlogPosts.length];

  return post.coverImage ?? fallback.coverImage ?? "/design/campus-courtyard.png";
}

function isRichTextDocument(
  body: BlogPost["body"],
): body is ContentfulRichTextDocument {
  return typeof body === "object" && body !== null && body.nodeType === "document";
}

function nodeText(node: ContentfulRichTextNode): string {
  if (node.value) {
    return node.value;
  }

  return node.content?.map(nodeText).join("") ?? "";
}

export function bodyToParagraphs(body: BlogPost["body"]): string[] {
  if (typeof body === "string") {
    return body
      .split(/\n{2,}/)
      .map((paragraph) => paragraph.trim())
      .filter(Boolean);
  }

  if (!isRichTextDocument(body)) {
    return [];
  }

  return body.content
    .map(nodeText)
    .map((paragraph) => paragraph.trim())
    .filter(Boolean);
}
