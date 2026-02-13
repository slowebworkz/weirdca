import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import slugify from "slugify";
import type { Category } from "@repo/types";

const BASE_URL = "https://www.weirdca.com";
const DATA_DIR = path.resolve(import.meta.dirname, "../data");
const DELAY_MS = 500;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const slug = slugify as any as (str: string, opts?: object) => string;

// Known category IDs from sitemap analysis
const CATEGORY_IDS: Record<number, string> = {
  19: "Animals",
  5: "Bizarre Buildings",
  16: "Forgotten Locales",
  6: "Hauntings",
  17: "History",
  7: "Legends",
  9: "Missing Treasures",
  10: "Monsters",
  18: "Natural Weirdness",
  11: "Roadside Attractions",
  20: "Seasonal Weird",
  12: "Weird",
  15: "Weird Outside California",
};

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

export async function scrapeCategories(): Promise<Category[]> {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const categories: Category[] = [];

  for (const [id, name] of Object.entries(CATEGORY_IDS)) {
    console.log(`Scraping category: ${name} (ID ${id})...`);
    let locationCount = 0;

    try {
      const html = await fetchPage(`${BASE_URL}/index.php?type=${id}`);
      const $ = cheerio.load(html);
      // Count unique location links on the category page
      const locationLinks = new Set<string>();
      $('a[href*="location.php?location="]').each((_, el) => {
        const href = $(el).attr("href");
        if (href) locationLinks.add(href);
      });
      locationCount = locationLinks.size;
    } catch (error) {
      console.error(`Failed to scrape category ${name}:`, error);
    }

    categories.push({
      id: Number(id),
      slug: slug(name, { lower: true, strict: true }),
      name,
      locationCount,
    });

    await sleep(DELAY_MS);
  }

  const outputPath = path.join(DATA_DIR, "categories.json");
  await fs.writeFile(outputPath, JSON.stringify(categories, null, 2));
  console.log(`\nWrote ${categories.length} categories to ${outputPath}`);

  return categories;
}

// Run directly if executed as a script
const isMain =
  process.argv[1] &&
  import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  scrapeCategories();
}
