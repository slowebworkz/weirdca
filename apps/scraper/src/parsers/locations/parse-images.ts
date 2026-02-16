import type { LocationImage } from "@repo/types";
import type { $ } from "@scraper/utils";
import { imageAttrs } from "@scraper/utils";

export function parseImages($: $) {
  const images: LocationImage[] = [];
  const pictureDivs = $(`div[class^="picture"]`);
  const lightboxLinks = $(`a[data-lightbox="weirdpict"]`);
  const seen = new Set<string>();

  for (const image of imageAttrs(pictureDivs, lightboxLinks)) {
    if (!image || seen.has(image.href)) continue;
    seen.add(image.href);
    images.push(image);
  }

  return images;
}
