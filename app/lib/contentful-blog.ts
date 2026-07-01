import { BlogPost, BlogPostEntry } from "../types/content";
import { contentfulClient } from "./contentful";



export async function getBlogPosts() {
    const entries = await contentfulClient.getEntries({
        content_type: "blogPost",
        order: ["-fields.datePublished"],
    });

    return (entries.items as unknown as BlogPostEntry[]).map((item): BlogPost => ({
        title: item.fields.title ?? "",
        slug: item.fields.slug ?? "",
        category: item.fields.category ?? "",
        excerpt: item.fields.excerpt ?? "",
        body: item.fields.body ?? "",
        datePublished: item.fields.datePublished ?? "",
        featured: item.fields.featured ?? false,
        coverImage: item.fields.coverImage
            ? `https:${item?.fields?.coverImage?.fields?.file?.url}`
            : null,
    }));
}
