import type { Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";

export function textTrim<T extends AnyNode>(el: Cheerio<T>): string {
  return el.text().trim();
}
