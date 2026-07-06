import type { Document } from "@contentful/rich-text-types";
import { contentfulClient } from "./contentful";
import type { ContentfulAsset } from "../types/content";

export type Event = {
  title: string;
  slug: string;
  status: string;
  date: string;
  time?: string;
  location: string;
  description?: string | Document;
  coverImage: string | null;
  featured: boolean;
  image: string;
  type: string;
  day: string;
  month: string;
};

type ContentfulEventEntry = {
  fields: {
    title?: string;
    slug?: string;
    status?: string;
    date?: string;
    time?: string;
    location?: string;
    description?: string | Document;
    coverImage?: ContentfulAsset;
    featured?: boolean;
  };
};

function getAssetUrl(item: ContentfulEventEntry): string {
  const url = item.fields.coverImage?.fields?.file?.url;
  return url ? `https:${url}` : "";
}

function formatDateFields(dateIso: string) {
  const date = new Date(dateIso);
  if (Number.isNaN(date.getTime())) {
    return { day: "01", month: "Jan" };
  }

  return {
    day: String(date.getUTCDate()).padStart(2, "0"),
    month: date.toLocaleString("en-US", { month: "short", timeZone: "UTC" }),
  };
}

function mapEvent(item: ContentfulEventEntry): Event {
  const date = item.fields.date ?? "";
  const { day, month } = date ? formatDateFields(date) : { day: "01", month: "Jan" };

  const imageUrl = getAssetUrl(item);

  return {
    title: item.fields.title ?? "Untitled event",
    slug: item.fields.slug ?? "",
    status: item.fields.status ?? "Live",
    date,
    time: item.fields.time,
    location: item.fields.location ?? "Campus",
    description: item.fields.description,
    coverImage: imageUrl,
    featured: item.fields.featured ?? false,
    image: imageUrl || "",
    type: item.fields.featured ? "Featured" : "Event",
    day,
    month,
  };
}

export async function getEvents(): Promise<Event[]> {
  const entries = await contentfulClient.getEntries({
    content_type: "events",
    order: ["fields.date"],
  });

  return (entries.items as unknown as ContentfulEventEntry[]).map(mapEvent);
}
