import type { OutsideReference } from "@repo/types";
import type { $ } from "@scraper/utils";
import { captureGroup, textTrim } from "@scraper/utils";

export function parseOutsideReferences($: $): OutsideReference[] {
  const refs: OutsideReference[] = [];
  const header = $("b:contains('Outside References:')");
  if (header.length > 0) {
    header
      .closest("p")
      .next("ul")
      .find("li")
      .each((_, el) => {
        const anchor = $(el).find("a");
        const url = anchor.attr("href") || "";
        const title = textTrim(anchor);
        if (!url || !title) return;

        const text = textTrim($(el));
        // Pattern: "Title (year) by Author, p: pages"
        const afterTitle = text.slice(title.length).trim();
        const match = afterTitle.match(
          /^\((\d{4})\)\s*by\s+(.+?)(?:,\s*p:\s*(.+))?$/,
        );

        if (match) {
          const pages = captureGroup(match, 3);
          refs.push({
            url,
            title,
            year: Number.parseInt(captureGroup(match, 1), 10),
            author: captureGroup(match, 2),
            ...(pages ? { pages } : {}),
          });
        } else {
          refs.push({ url, title });
        }
      });
  }
  return refs;
}
