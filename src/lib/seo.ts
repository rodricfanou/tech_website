export const SITE_URL = "https://novarisnexustech.com";
export const SITE_NAME = "Novaris Nexus Tech";

const OG_WIDTH = 1200;
const OG_HEIGHT = 627;

type OgImage = {
  path: string;
  alt: string;
  width?: number;
  height?: number;
};

export function ogImageMeta(image: OgImage) {
  const width = image.width ?? OG_WIDTH;
  const height = image.height ?? OG_HEIGHT;
  const url = SITE_URL + image.path;
  return [
    { property: "og:image", content: url },
    { property: "og:image:type", content: "image/png" },
    { property: "og:image:width", content: String(width) },
    { property: "og:image:height", content: String(height) },
    { property: "og:image:alt", content: image.alt },
    { name: "twitter:image", content: url },
  ];
}

/**
 * A self-referencing absolute URL, so search engines treat this as the one
 * address for the page instead of guessing between trailing slashes and
 * tracking parameters.
 */
export function canonicalMeta(path: string) {
  return [{ rel: "canonical", href: SITE_URL + path }];
}

export function socialMeta({
  title,
  description,
  path,
  image,
}: {
  title: string;
  description: string;
  path: string;
  image: OgImage;
}) {
  const url = SITE_URL + path;
  return [
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:type", content: "website" },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    ...ogImageMeta(image),
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
  ];
}
