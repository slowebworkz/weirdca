import type { OutsideLink } from "@repo/types";
import type { $ } from "@scraper/utils";
import { textTrim } from "@scraper/utils";

export function parseOutsideLinks($: $): OutsideLink[] {
  const links: OutsideLink[] = [];
  const header = $("b:contains('Outside Links:')");
  if (header.length > 0) {
    header
      .closest("p")
      .next("ul")
      .find("li")
      .each((_, el) => {
        const anchor = $(el).find("a");
        const url = anchor.attr("href") || "";
        const title = textTrim(anchor);
        if (url && title) links.push({ url, title });
      });
  }
  return links;
}
