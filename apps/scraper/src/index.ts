/**
 * WeirdCA Scraper
 *
 * Scrapes location data from weirdca.com and outputs structured JSON.
 *
 * Usage:
 *   pnpm scrape              - Run full scrape pipeline
 *   pnpm scrape:locations    - Scrape individual location pages
 *   pnpm scrape:categories   - Scrape category listings
 */

import { scrapeCategories } from "./scrape-categories";
import { scrapeLocations } from "./scrape-locations";

async function main() {
  console.log("WeirdCA Scraper - Starting full pipeline\n");
  const start = Date.now();

  console.log("=== Phase 1: Categories ===\n");
  const categories = await scrapeCategories();

  console.log("\n=== Phase 2: Locations ===\n");
  const locations = await scrapeLocations();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  console.log(`\n=== Pipeline Complete ===`);
  console.log(`Categories: ${categories.length}`);
  console.log(`Locations: ${locations.length}`);
  console.log(`Total time: ${elapsed}s`);
}

main();
