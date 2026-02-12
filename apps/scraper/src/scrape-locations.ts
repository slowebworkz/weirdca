import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import slugify from "slugify";
import type { Location, LocationImage, RelatedLocation, Comment } from "@repo/types";

const BASE_URL = "https://www.weirdca.com";
const DATA_DIR = path.resolve(import.meta.dirname, "../data");
const DELAY_MS = 500; // Be polite to the server

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
  return slugify(`${title} ${city}`, { lower: true, strict: true });
}

function parseLocationPage(html: string, id: number): Location | null {
  const $ = cheerio.load(html);

  // TODO: Implement HTML parsing based on weirdca.com page structure
  // The page structure uses server-rendered HTML with:
  // - Title in an h1 or heading element
  // - Address block with street, city, state, zip
  // - Category link
  // - Description in main content area
  // - Image gallery with paths like gallery/var/albums/Weird/California/{County}/{Slug}/*.jpg
  // - Related locations with distance in miles
  // - Comments on separate page (comment.php?location=ID)

  const title = $("title").text().replace(" - Weird California", "").trim();
  if (!title) return null;

  return {
    id,
    slug: makeSlug(title, ""),
    title,
    address: "",
    city: "",
    county: "",
    state: "California",
    zip: "",
    latitude: null,
    longitude: null,
    category: "",
    subcategory: null,
    description: "",
    images: [],
    relatedLocations: [],
    comments: [],
    dateCreated: "",
    dateEdited: "",
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

async function main() {
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
}

main();
