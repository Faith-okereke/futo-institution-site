import { posts } from "@/app/data/site";
import { createClient } from "contentful-management";
import type { Asset, Environment } from "contentful-management";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const {
  CONTENTFUL_MANAGEMENT_TOKEN,
  CONTENTFUL_SPACE_ID,
  CONTENTFUL_ENVIRONMENT_ID = "master",
  CONTENTFUL_LOCALE = "en-US",
} = process.env;

if (!CONTENTFUL_MANAGEMENT_TOKEN || !CONTENTFUL_SPACE_ID) {
  throw new Error(
    "Missing CONTENTFUL_MANAGEMENT_TOKEN or CONTENTFUL_SPACE_ID in .env.local."
  );
}

const CONTENT_TYPE_ID = "blogPost";

const client = createClient({
  accessToken: CONTENTFUL_MANAGEMENT_TOKEN,
});

const sleep = (ms: number) =>
  new Promise<void>((resolve) => setTimeout(resolve, ms));

function richTextDocument(paragraphs: string[]) {
  return {
    nodeType: "document" as const,
    data: {},
    content: paragraphs.map((text) => ({
      nodeType: "paragraph" as const,
      data: {},
      content: [
        {
          nodeType: "text" as const,
          value: text,
          marks: [],
          data: {},
        },
      ],
    })),
  };
}

function safeFileName(title: string) {
  return `${title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")}.jpg`;
}

/**
 * Polls Contentful directly instead of using asset.processForLocale(),
 * whose built-in SDK timeout is too short for some remote images.
 */
async function waitForAssetProcessing(
  environment: Environment,
  assetId: string,
  locale: string
): Promise<Asset> {
  const maxAttempts = 80; // 80 × 3 seconds = 4 minutes

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    const asset = await environment.getAsset(assetId);
    const file = asset.fields.file?.[locale];

    if (
      file &&
      typeof file === "object" &&
      "url" in file &&
      typeof file.url === "string" &&
      file.url.length > 0
    ) {
      return asset;
    }

    console.log(`  Waiting for image processing... (${attempt}/${maxAttempts})`);
    await sleep(3000);
  }

  throw new Error(
    `Image processing did not finish after 4 minutes for asset ${assetId}.`
  );
}

async function requestAssetProcessing(
  assetId: string,
  locale: string
): Promise<void> {
  const url =
    `https://api.contentful.com/spaces/${CONTENTFUL_SPACE_ID}` +
    `/environments/${CONTENTFUL_ENVIRONMENT_ID}` +
    `/assets/${assetId}/files/${locale}/process`;

  const response = await fetch(url, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${CONTENTFUL_MANAGEMENT_TOKEN}`,
      "Content-Type": "application/vnd.contentful.management.v1+json",
    },
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Could not request image processing (${response.status}): ${errorText}`
    );
  }
}

async function createCoverImage(
  environment: Environment,
  title: string,
  imageUrl: string
): Promise<Asset> {
  console.log("  Creating image asset...");

  const asset = await environment.createAsset({
    fields: {
      title: {
        [CONTENTFUL_LOCALE]: title,
      },
      file: {
        [CONTENTFUL_LOCALE]: {
          contentType: "image/jpeg",
          fileName: safeFileName(title),
          upload: imageUrl,
        },
      },
    },
  });

  console.log("  Requesting Contentful image processing...");
  await requestAssetProcessing(asset.sys.id, CONTENTFUL_LOCALE);

  const processedAsset = await waitForAssetProcessing(
    environment,
    asset.sys.id,
    CONTENTFUL_LOCALE
  );

  console.log("  Publishing image...");
  return processedAsset.publish();
}

async function seedPosts() {
  const space = await client.getSpace(CONTENTFUL_SPACE_ID);
  const environment = await space.getEnvironment(CONTENTFUL_ENVIRONMENT_ID);

  for (const post of posts) {
    try {
      const existingEntries = await environment.getEntries({
        content_type: CONTENT_TYPE_ID,
        "fields.slug": post.slug,
        limit: 1,
      });

      if (existingEntries.items.length > 0) {
        console.log(`Skipping existing post: ${post.title}`);
        continue;
      }

      console.log(`Creating: ${post.title}`);

      const coverImage = await createCoverImage(
        environment,
        post.coverImageTitle,
        post.coverImageUrl
      );

      const entry = await environment.createEntry(CONTENT_TYPE_ID, {
        fields: {
          title: { [CONTENTFUL_LOCALE]: post.title },
          slug: { [CONTENTFUL_LOCALE]: post.slug },
          category: { [CONTENTFUL_LOCALE]: post.category },
          excerpt: { [CONTENTFUL_LOCALE]: post.excerpt },
          body: {
            [CONTENTFUL_LOCALE]: richTextDocument(post.body),
          },
          coverImage: {
            [CONTENTFUL_LOCALE]: {
              sys: {
                type: "Link",
                linkType: "Asset",
                id: coverImage.sys.id,
              },
            },
          },
          datePublished: {
            [CONTENTFUL_LOCALE]: post.datePublished,
          },
          featured: { [CONTENTFUL_LOCALE]: post.featured },
        },
      });

      await entry.publish();

      console.log(`✓ Published: ${post.title}`);
    } catch (error) {
      console.error(`✗ Failed: ${post.title}`);
      console.error(error);
    }
  }

  console.log("\nFinished seeding blog posts.");
}

seedPosts().catch((error) => {
  console.error("\nSeeding failed:");
  console.error(error);
  process.exit(1);
});