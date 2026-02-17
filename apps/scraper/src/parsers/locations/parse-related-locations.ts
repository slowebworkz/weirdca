import type { RelatedLocation } from "@repo/types";
import type { $ } from "@scraper/utils";
import { captureGroup, makeSlug, stripHtml } from "@scraper/utils";

export function parseRelatedLocations($: $): RelatedLocation[] {
  const related: RelatedLocation[] = [];
  $("div.nearby").each((_, el) => {
    const link = $(el).parent("a");
    const href = link.attr("href") || "";
    const idMatch = href.match(/location=(\d+)/);
    if (!idMatch) return;

    const parts = $(el).find("p").html()?.split("<br>") || [];
    const relTitle = stripHtml(parts[0] ?? "").trim();
    const distanceText = parts.find((p) => p.includes("Miles Away")) || "";
    const distanceMatch = distanceText.match(/([\d.]+)\s*Miles?\s*Away/i);
    const relCity = stripHtml(parts.at(-1) ?? "")
      .replace(/,\s*California$/, "")
      .trim();

    related.push({
      id: Number.parseInt(captureGroup(idMatch, 1)),
      slug: makeSlug(relTitle, relCity),
      title: relTitle,
      city: relCity,
      distanceMiles: distanceMatch
        ? Number.parseFloat(captureGroup(distanceMatch, 1))
        : 0,
    });
  });
  return related;
}
