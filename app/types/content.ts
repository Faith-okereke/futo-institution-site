export type ContentfulRichTextNode = {
    nodeType: string;
    value?: string;
    content?: ContentfulRichTextNode[];
};

export type ContentfulRichTextDocument = {
    nodeType: "document";
    content: ContentfulRichTextNode[];
};

export interface BlogPost {
    title: string;
    slug: string;
    category: string;
    excerpt: string;
    body: string | ContentfulRichTextDocument;
    datePublished: string; // or Date if you parse it
    featured: boolean;
    coverImage: string | null;
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
        category?: string;
        excerpt?: string;
        body?: string | ContentfulRichTextDocument;
        datePublished?: string;
        featured?: boolean;
        coverImage?: ContentfulAsset;
    };
};
