import { createClient } from "contentful";

const contentfulSpaceId = process.env.CONTENTFUL_SPACE_ID;
const contentfulAccessToken =
  process.env.CONTENTFUL_ACCESS_TOKEN || process.env.CONTENTFUL_PREVIEW_ACCESS_TOKEN;
const contentfulEnvironment =
  process.env.CONTENTFUL_ENVIRONMENT || process.env.CONTENTFUL_ENVIRONMENT_ID || "master";

if (!contentfulSpaceId || !contentfulAccessToken) {
  throw new Error(
    "Missing Contentful configuration: CONTENTFUL_SPACE_ID and CONTENTFUL_ACCESS_TOKEN or CONTENTFUL_PREVIEW_ACCESS_TOKEN are required.",
  );
}

export const contentfulClient = createClient({
  space: contentfulSpaceId,
  accessToken: contentfulAccessToken,
  environment: contentfulEnvironment,
});