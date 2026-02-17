import type { $ } from "@scraper/utils";
import { captureGroup } from "@scraper/utils";

export function parseCounty($: $): string {
  let result = "";

  const galleryLink = $('a[data-lightbox="weirdpict"]').first().attr("href");
  if (galleryLink) {
    const match = galleryLink.match(
      /gallery\/var\/albums\/Weird\/California\/([^/]+)\//,
    );

    if (captureGroup(match, 1)) {
      result = captureGroup(match, 1).replaceAll("-", " ");
    }
  }

  return result;
}
