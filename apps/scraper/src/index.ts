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
import { header, log } from "./utils";

async function main() {
  const start = Date.now();
  log("WeirdCA Scraper - Starting full pipeline");

  header("Phase 1: Categories");
  const categories = await scrapeCategories();

  header("Phase 2: Locations");
  const locations = await scrapeLocations();

  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  header("Pipeline Complete");
  log(`Categories: ${categories.length}`);
  log(`Locations: ${locations.length}`);
  log(`Total time: ${elapsed}s`);
}

main();
