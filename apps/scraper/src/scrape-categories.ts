import * as cheerio from "cheerio";
import * as fs from "node:fs/promises";
import * as path from "node:path";
import slugify from "slugify";
import type { Category } from "@repo/types";

const BASE_URL = "https://www.weirdca.com";
const DATA_DIR = path.resolve(import.meta.dirname, "../data");

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

async function main() {
  await fs.mkdir(DATA_DIR, { recursive: true });

  const categories: Category[] = Object.entries(CATEGORY_IDS).map(
    ([id, name]) => ({
      id: Number(id),
      slug: slugify(name, { lower: true, strict: true }),
      name,
      locationCount: 0,
    })
  );

  // TODO: Scrape each category page to get accurate location counts
  // and subcategory information

  const outputPath = path.join(DATA_DIR, "categories.json");
  await fs.writeFile(outputPath, JSON.stringify(categories, null, 2));
  console.log(`Wrote ${categories.length} categories to ${outputPath}`);
}

main();
