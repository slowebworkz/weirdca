import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import slugify from "slugify";
import type { Location, LocationImage, RelatedLocation, Comment } from "@repo/types";

const BASE_URL = "https://www.weirdca.com";
const DATA_DIR = path.resolve(import.meta.dirname, "../data");
const DELAY_MS = 500; // Be polite to the server

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slug = slugify as any as (str: string, opts?: object) => string;

async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function makeSlug(title: string, city: string): string {
  return slug(`${title} ${city}`, { lower: true, strict: true });
}

function parseComment(liText: string): Comment | null {
  // Pattern: "Name of City, State on YYYY-MM-DD said: comment text"
  const withCity = liText.match(
    /^(.+?)\s+of\s+(.+?),\s*(\S+)\s+on\s+(\d{4}-\d{2}-\d{2})\s+said:\s*([\s\S]+)$/
  );
  if (withCity) {
    return {
      name: withCity[1]!.trim(),
      city: withCity[2]!.trim(),
      state: withCity[3]!.trim(),
      text: withCity[5]!.trim(),
      date: withCity[4]!,
    };
  }
  // Pattern without city: "Anonymous on YYYY-MM-DD said: comment text"
  const noCity = liText.match(
    /^(.+?)\s+on\s+(\d{4}-\d{2}-\d{2})\s+said:\s*([\s\S]+)$/
  );
  if (noCity) {
    return {
      name: noCity[1]!.trim(),
      city: null,
      state: null,
      text: noCity[3]!.trim(),
      date: noCity[2]!,
    };
  }
  return null;
}

function parseLocationPage(html: string, id: number): Location | null {
  const $ = cheerio.load(html);

  const title = $("title").text().replace(" - Weird California", "").trim();
  if (!title || title === "Weird California") return null;

  // Category from the sidebar menu
  const category = $("#menu h1 a").first().text().trim();

  // Latitude / Longitude from OpenGraph meta tags
  const latStr = $('meta[property="og:latitude"]').attr("content");
  const lngStr = $('meta[property="og:longitude"]').attr("content");
  const latitude = latStr ? parseFloat(latStr) : null;
  const longitude = lngStr ? parseFloat(lngStr) : null;

  // Address from div#address
  const addressDiv = $("#address");
  const city =
    addressDiv.find('a[href^="search2.php?city="]').first().text().trim() || "";
  const addressText = addressDiv.text().trim();
  let address = "";
  let zip = "";
  if (addressText) {
    // Pattern: "Street, City, California ZIP\n(extra info)"
    const addressMatch = addressText.match(
      /^(.+?),\s*[^,]+,\s*California\s*(\d{5})?/
    );
    if (addressMatch) {
      address = (addressMatch[1] ?? "").trim();
      zip = addressMatch[2] ?? "";
    }
  }

  // County from gallery image paths (gallery/var/albums/Weird/California/{County}/...)
  let county = "";
  const galleryLink = $('a[data-lightbox="weirdpict"]').first().attr("href");
  if (galleryLink) {
    const countyMatch = galleryLink.match(
      /gallery\/var\/albums\/Weird\/California\/([^/]+)\//
    );
    if (countyMatch) {
      county = (countyMatch[1] ?? "").replace(/-/g, " ");
    }
  }

  // Images from lightbox links
  const images: LocationImage[] = [];
  $('a[data-lightbox="weirdpict"]').each((_, el) => {
    const href = $(el).attr("href");
    const img = $(el).find("img");
    const alt = img.attr("alt") || img.attr("title") || "";
    if (href) {
      images.push({
        src: `${BASE_URL}/${href}`,
        alt,
      });
    }
  });

  // Description: collect <p> tags from main content between #address and "Closest Weird"
  const descriptionParts: string[] = [];
  let current = addressDiv.next();
  while (current.length) {
    const tagName = (current.prop("tagName") as string | undefined)?.toLowerCase();
    const text = current.text().trim();

    // Stop at "Closest Weird" section or follow/buttons divs
    if (
      text.includes("Closest Weird") ||
      current.hasClass("follow") ||
      current.hasClass("buttons")
    ) {
      break;
    }

    // Collect paragraph text, skip image-only divs
    if (tagName === "p" && text && !current.find("b:contains('Comments')").length) {
      const paraText = text.replace(/\s+/g, " ").trim();
      if (paraText) {
        descriptionParts.push(paraText);
      }
    }

    current = current.next();
  }
  const description = descriptionParts.join("\n\n");

  // Related locations ("Closest Weird")
  const relatedLocations: RelatedLocation[] = [];
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

    relatedLocations.push({
      id: parseInt(idMatch[1]!),
      slug: makeSlug(relTitle, relCity),
      title: relTitle,
      city: relCity,
      distanceMiles: distanceMatch ? parseFloat(distanceMatch[1]!) : 0,
    });
  });

  // Comments: inline on the page as <li> elements after "Comments:" header
  const comments: Comment[] = [];
  const commentsHeader = $("b:contains('Comments:')");
  if (commentsHeader.length) {
    commentsHeader
      .closest("p")
      .next("ul")
      .find("li")
      .each((_, el) => {
        const parsed = parseComment($(el).text().trim());
        if (parsed) comments.push(parsed);
      });
  }

  // Dates
  let dateCreated = "";
  let dateEdited = "";
  const dateBlock = $("i:contains('First Created:')").text();
  if (dateBlock) {
    const createdMatch = dateBlock.match(/First Created:\s*(\d{4}-\d{2}-\d{2})/);
    const editedMatch = dateBlock.match(/Last Edited:\s*(\d{4}-\d{2}-\d{2})/);
    if (createdMatch) dateCreated = createdMatch[1]!;
    if (editedMatch) dateEdited = editedMatch[1]!;
  }

  return {
    id,
    slug: makeSlug(title, city),
    title,
    address,
    city,
    county,
    state: "California",
    zip,
    latitude,
    longitude,
    category,
    subcategory: null,
    description,
    images,
    relatedLocations,
    comments,
    dateCreated,
    dateEdited,
  };
}

async function scrapeLocation(id: number): Promise<Location | null> {
  try {
    const html = await fetchPage(`${BASE_URL}/location.php?location=${id}`);
    return parseLocationPage(html, id);
  } catch (error) {
    console.error(`Failed to scrape location ${id}:`, error);
    return null;
  }
}

export async function scrapeLocations(): Promise<Location[]> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  // Known max ID is ~1235, but IDs are sparse
  const MAX_ID = 1235;
  const locations: Location[] = [];

  console.log(`Scraping locations 1 through ${MAX_ID}...`);

  for (let id = 1; id <= MAX_ID; id++) {
    const location = await scrapeLocation(id);
    if (location) {
      locations.push(location);
      console.log(`[${id}/${MAX_ID}] ${location.title}`);
    }
    await sleep(DELAY_MS);
  }

  const outputPath = path.join(DATA_DIR, "locations.json");
  await fs.writeFile(outputPath, JSON.stringify(locations, null, 2));
  console.log(`\nDone! Scraped ${locations.length} locations to ${outputPath}`);

  return locations;
}

// Run directly if executed as a script
const isMain =
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  scrapeLocations();
}
