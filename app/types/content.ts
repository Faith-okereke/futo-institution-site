import { Document } from "@contentful/rich-text-types";
export type ContentfulRichTextDocument = Document;
export type ContentfulRichTextNode = {
    nodeType: string;
    value?: string;
    content?: ContentfulRichTextNode[];
};
export type Category =
  | "Research"
  | "Academics"
  | "Admissions"
  | "Campus Life"
  | "Innovation"
  | "Events"
  | "Announcements";

export interface BlogPost {
    title: string
    slug: string;
    category: Category[];
    excerpt: string;
    body: string | Document;
    datePublished: string; // or Date if you parse it
    featured: boolean;
    coverImage: string | null;
}

export interface Course {
  title: string;
  slug: string;
  courseCode: string;
}

export type ContentfulAsset = {
    fields?: {
        file?: {
            url?: string;
        };
    };
};

export type BlogPostEntry = {
    fields: {
        title?: string;
        slug?: string;
        category?: string[];
        excerpt?: string;
        body?: string | Document;
        datePublished?: string;
        featured?: boolean;
        coverImage?: ContentfulAsset;
    };
};
