import * as cheerio from "cheerio";
import type {
  Comment,
  Geo,
  Location,
  LocationDetails,
  LocationImage,
  OutsideLink,
  OutsideReference,
  RelatedLocation,
} from "@repo/types";
import { type $, BASE_URL, captureGroup, makeSlug, stripHtml } from "../utils";
import { parseComment } from "./comment";

function parseAddress($: $) {
  const addressDiv = $("#address");
  const city =
    addressDiv.find('a[href^="search2.php?city="]').first().text().trim() || "";
  const addressText = addressDiv.text().trim();
  let address = "";
  let zip = "";
  if (addressText) {
    const match = addressText.match(/^(.+?),\s*[^,]+,\s*California\s*(\d{5})?/);
    if (match) {
      address = captureGroup(match, 1);
      zip = captureGroup(match, 2);
    }
  }
  return { addressDiv, address, city, zip };
}

function parseCounty($: $): string {
  const galleryLink = $('a[data-lightbox="weirdpict"]').first().attr("href");
  if (!galleryLink) return "";
  const match = galleryLink.match(
    /gallery\/var\/albums\/Weird\/California\/([^/]+)\//,
  );
  return captureGroup(match, 1).replace(/-/g, " ");
}

function classToPosition(cls: string | undefined): LocationImage["position"] {
  if (!cls) return null;
  if (cls.includes("right")) return "right";
  if (cls.includes("center")) return "center";
  return "left";
}

function parseImages($: $): LocationImage[] {
  const images: LocationImage[] = [];
  const seen = new Set<string>();

  // Images wrapped in picture divs (primary path)
  $('div[class^="picture"]').each((_, el) => {
    const div = $(el);
    const link = div.find('a[data-lightbox="weirdpict"]');
    const href = link.attr("href");
    if (!href) return;

    const img = link.find("img");
    const src = `${BASE_URL}/${href}`;
    seen.add(href);

    const widthAttr = img.attr("width");
    const heightAttr = img.attr("height");
    const thumbSrc = img.attr("src");

    images.push({
      src,
      alt: img.attr("alt") || img.attr("title") || "",
      caption: div.find(".caption").text().trim() || null,
      thumbnailSrc: thumbSrc ? `${BASE_URL}/${thumbSrc}` : null,
      position: classToPosition(div.attr("class")),
      width: widthAttr ? parseInt(widthAttr, 10) : null,
      height: heightAttr ? parseInt(heightAttr, 10) : null,
    });
  });

  // Fallback: lightbox links not inside a picture div
  $('a[data-lightbox="weirdpict"]').each((_, el) => {
    const href = $(el).attr("href");
    if (!href || seen.has(href)) return;

    const img = $(el).find("img");
    const widthAttr = img.attr("width");
    const heightAttr = img.attr("height");
    const thumbSrc = img.attr("src");

    images.push({
      src: `${BASE_URL}/${href}`,
      alt: img.attr("alt") || img.attr("title") || "",
      caption: null,
      thumbnailSrc: thumbSrc ? `${BASE_URL}/${thumbSrc}` : null,
      position: null,
      width: widthAttr ? parseInt(widthAttr, 10) : null,
      height: heightAttr ? parseInt(heightAttr, 10) : null,
    });
  });

  return images;
}

function parseDescription(
  $: $,
  addressDiv: ReturnType<typeof parseAddress>["addressDiv"],
): string {
  const parts: string[] = [];
  let current = addressDiv.next();
  while (current.length) {
    const tagName = (
      current.prop("tagName") as string | undefined
    )?.toLowerCase();
    const text = current.text().trim();

    if (
      text.includes("Closest Weird") ||
      current.hasClass("follow") ||
      current.hasClass("buttons")
    ) {
      break;
    }

    if (
      tagName === "p" &&
      text &&
      !current.find("b:contains('Comments')").length
    ) {
      const paraText = text.replace(/\s+/g, " ").trim();
      if (paraText) parts.push(paraText);
    }

    current = current.next();
  }
  return parts.join("\n\n");
}

function parseRelatedLocations($: $): RelatedLocation[] {
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
    const relCity = stripHtml(parts[parts.length - 1] ?? "")
      .replace(/,\s*California$/, "")
      .trim();

    related.push({
      id: parseInt(captureGroup(idMatch, 1)),
      slug: makeSlug(relTitle, relCity),
      title: relTitle,
      city: relCity,
      distanceMiles: distanceMatch
        ? parseFloat(captureGroup(distanceMatch, 1))
        : 0,
    });
  });
  return related;
}

function parseComments($: $): Comment[] {
  const comments: Comment[] = [];
  const header = $("b:contains('Comments:')");
  if (header.length) {
    header
      .closest("p")
      .next("ul")
      .find("li")
      .each((_, el) => {
        const parsed = parseComment($(el).text().trim());
        if (parsed) comments.push(parsed);
      });
  }
  return comments;
}

function parseOutsideLinks($: $): OutsideLink[] {
  const links: OutsideLink[] = [];
  const header = $("b:contains('Outside Links:')");
  if (header.length) {
    header
      .closest("p")
      .next("ul")
      .find("li")
      .each((_, el) => {
        const anchor = $(el).find("a");
        const url = anchor.attr("href") || "";
        const title = anchor.text().trim();
        if (url && title) links.push({ url, title });
      });
  }
  return links;
}

function parseOutsideReferences($: $): OutsideReference[] {
  const refs: OutsideReference[] = [];
  const header = $("b:contains('Outside References:')");
  if (header.length) {
    header
      .closest("p")
      .next("ul")
      .find("li")
      .each((_, el) => {
        const anchor = $(el).find("a");
        const url = anchor.attr("href") || "";
        const title = anchor.text().trim();
        if (!url || !title) return;

        const text = $(el).text().trim();
        // Pattern: "Title (year) by Author, p: pages"
        const afterTitle = text.slice(title.length).trim();
        const match = afterTitle.match(
          /^\((\d{4})\)\s*by\s+(.+?)(?:,\s*p:\s*(.+))?$/,
        );

        const ref: OutsideReference = { url, title };
        if (match) {
          ref.year = parseInt(captureGroup(match, 1), 10);
          ref.author = captureGroup(match, 2);
          const pages = captureGroup(match, 3);
          if (pages) ref.pages = pages;
        }
        refs.push(ref);
      });
  }
  return refs;
}

function parseDates($: $) {
  const dateBlock = $("i:contains('First Created:')").text();
  const dateCreated = captureGroup(
    dateBlock.match(/First Created:\s*(\d{4}-\d{2}-\d{2})/),
    1,
  );
  const dateEdited = captureGroup(
    dateBlock.match(/Last Edited:\s*(\d{4}-\d{2}-\d{2})/),
    1,
  );
  return { dateCreated, dateEdited };
}

function buildLocationDetails(
  city: string,
  address: string,
  county: string,
  zip: string,
  latStr: string | undefined,
  lngStr: string | undefined,
): LocationDetails | undefined {
  if (!city) return undefined;

  const geo: Geo | undefined =
    latStr && lngStr
      ? { latitude: parseFloat(latStr), longitude: parseFloat(lngStr) }
      : undefined;

  const details: LocationDetails = { city, state: "California" };
  if (address) details.address = address;
  if (county) details.county = county;
  if (zip) details.zip = zip;
  if (geo) details.geo = geo;

  return details;
}

export function parseLocationPage(html: string, id: number): Location | null {
  const $ = cheerio.load(html);

  const title = $("title").text().replace(" - Weird California", "").trim();
  if (!title || title === "Weird California") return null;

  const category = $("#menu h1 a").first().text().trim();
  const latStr = $('meta[property="og:latitude"]').attr("content");
  const lngStr = $('meta[property="og:longitude"]').attr("content");
  const { addressDiv, address, city, zip } = parseAddress($);
  const county = parseCounty($);
  const { dateCreated, dateEdited } = parseDates($);

  return {
    id,
    slug: makeSlug(title, city),
    title,
    location: buildLocationDetails(city, address, county, zip, latStr, lngStr),
    category,
    subcategory: null,
    description: parseDescription($, addressDiv),
    images: parseImages($),
    relatedLocations: parseRelatedLocations($),
    comments: parseComments($),
    outsideLinks: parseOutsideLinks($),
    outsideReferences: parseOutsideReferences($),
    dateCreated,
    dateEdited,
  };
}
