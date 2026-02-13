import * as cheerio from "cheerio";
import type { Comment, Location, LocationImage, RelatedLocation } from "@repo/types";
import { BASE_URL, makeSlug } from "../utils";
import { parseComment } from "./comment";

function parseAddress($: cheerio.CheerioAPI) {
  const addressDiv = $("#address");
  const city =
    addressDiv.find('a[href^="search2.php?city="]').first().text().trim() || "";
  const addressText = addressDiv.text().trim();
  let address = "";
  let zip = "";
  if (addressText) {
    const match = addressText.match(/^(.+?),\s*[^,]+,\s*California\s*(\d{5})?/);
    if (match) {
      address = (match[1] ?? "").trim();
      zip = match[2] ?? "";
    }
  }
  return { addressDiv, address, city, zip };
}

function parseCounty($: cheerio.CheerioAPI): string {
  const galleryLink = $('a[data-lightbox="weirdpict"]').first().attr("href");
  if (!galleryLink) return "";
  const match = galleryLink.match(
    /gallery\/var\/albums\/Weird\/California\/([^/]+)\//
  );
  return match ? (match[1] ?? "").replace(/-/g, " ") : "";
}

function parseImages($: cheerio.CheerioAPI): LocationImage[] {
  const images: LocationImage[] = [];
  $('a[data-lightbox="weirdpict"]').each((_, el) => {
    const href = $(el).attr("href");
    const img = $(el).find("img");
    const alt = img.attr("alt") || img.attr("title") || "";
    if (href) {
      images.push({ src: `${BASE_URL}/${href}`, alt });
    }
  });
  return images;
}

function parseDescription(
  $: cheerio.CheerioAPI,
  addressDiv: cheerio.Cheerio<cheerio.Element>,
): string {
  const parts: string[] = [];
  let current = addressDiv.next();
  while (current.length) {
    const tagName = (current.prop("tagName") as string | undefined)?.toLowerCase();
    const text = current.text().trim();

    if (
      text.includes("Closest Weird") ||
      current.hasClass("follow") ||
      current.hasClass("buttons")
    ) {
      break;
    }

    if (tagName === "p" && text && !current.find("b:contains('Comments')").length) {
      const paraText = text.replace(/\s+/g, " ").trim();
      if (paraText) parts.push(paraText);
    }

    current = current.next();
  }
  return parts.join("\n\n");
}

function parseRelatedLocations($: cheerio.CheerioAPI): RelatedLocation[] {
  const related: RelatedLocation[] = [];
  $("div.nearby").each((_, el) => {
    const link = $(el).parent("a");
    const href = link.attr("href") || "";
    const idMatch = href.match(/location=(\d+)/);
    if (!idMatch) return;

    const parts = $(el).find("p").html()?.split("<br>") || [];
    const relTitle = (parts[0] ?? "").replace(/<[^>]*>/g, "").trim();
    const distanceText = parts.find((p) => p.includes("Miles Away")) || "";
    const distanceMatch = distanceText.match(/([\d.]+)\s*Miles?\s*Away/i);
    const cityText = (parts[parts.length - 1] ?? "").replace(/<[^>]*>/g, "").trim();
    const relCity = cityText.replace(/,\s*California$/, "").trim();

    related.push({
      id: parseInt(idMatch[1]!),
      slug: makeSlug(relTitle, relCity),
      title: relTitle,
      city: relCity,
      distanceMiles: distanceMatch ? parseFloat(distanceMatch[1]!) : 0,
    });
  });
  return related;
}

function parseComments($: cheerio.CheerioAPI): Comment[] {
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

function parseDates($: cheerio.CheerioAPI) {
  let dateCreated = "";
  let dateEdited = "";
  const dateBlock = $("i:contains('First Created:')").text();
  if (dateBlock) {
    const createdMatch = dateBlock.match(/First Created:\s*(\d{4}-\d{2}-\d{2})/);
    const editedMatch = dateBlock.match(/Last Edited:\s*(\d{4}-\d{2}-\d{2})/);
    if (createdMatch) dateCreated = createdMatch[1]!;
    if (editedMatch) dateEdited = editedMatch[1]!;
  }
  return { dateCreated, dateEdited };
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
    address,
    city,
    county,
    state: "California",
    zip,
    latitude: latStr ? parseFloat(latStr) : null,
    longitude: lngStr ? parseFloat(lngStr) : null,
    category,
    subcategory: null,
    description: parseDescription($, addressDiv),
    images: parseImages($),
    relatedLocations: parseRelatedLocations($),
    comments: parseComments($),
    dateCreated,
    dateEdited,
  };
}
