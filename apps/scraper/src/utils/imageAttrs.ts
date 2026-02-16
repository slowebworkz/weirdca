import type { Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";
import { textTrim } from "./texttrim";
import { BASE_URL } from "./constants";
import type { LocationImage } from "@repo/types";

const LINK_PATTERN = `a[data-lightbox="weirdpict"]`;

export function* imageAttrs<T extends AnyNode>(
  ...containers: Cheerio<T>[]
): Generator<LocationImage | null> {
  for (const div of parseImages(...containers)) {
    const link = div.find<T>(LINK_PATTERN);
    if (!link.length) {
      yield null;
      continue;
    }

    const href = link.attr("href") || "";
    const img = link.find("img");
    const [width, height, thumbSrc, alt] = [
      "width",
      "height",
      "src",
      "alt",
    ].map((attr) => img.attr(attr));

    yield {
      src: href ? `${BASE_URL}/${href}` : "",
      href,
      alt: alt || img.attr("title") || "",
      caption: textTrim(div.find(".caption")) || null,
      thumbnailSrc: thumbSrc ? `${BASE_URL}/${thumbSrc}` : null,
      position: classToPosition(div.attr("class")),
      width: width ? parseInt(width, 10) : null,
      height: height ? parseInt(height, 10) : null,
    };
  }
}

function* parseImages<T extends AnyNode>(
  ...containers: Cheerio<T>[]
): Generator<Cheerio<T>, void, unknown> {
  for (const container of containers) {
    let index = 0;

    while (index < container.length) {
      yield container.eq(index);
      index++;
    }
  }
}

function classToPosition(cls: string | undefined): LocationImage["position"] {
  if (!cls) return null;
  if (cls.includes("right")) return "right";
  if (cls.includes("center")) return "center";
  return "left";
}
