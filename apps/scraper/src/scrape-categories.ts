import * as cheerio from "cheerio";
import type { Category } from "@repo/types";
import {
  BASE_URL,
  CONCURRENCY,
  DELAY_MS,
  error,
  fetchPageWithRetry,
  log,
  makeSlug,
  writeJSON,
} from "@scraper/utils";
import PQueue from "p-queue";

async function discoverCategories(): Promise<Map<number, string>> {
  log("Discovering categories from homepage...");
  const html = await fetchPageWithRetry(BASE_URL);
  const $ = cheerio.load(html);
  const categories = new Map<number, string>();

  $('a[href*="index.php?type="]').each((_, el) => {
    const href = $(el).attr("href");
    const match = href?.match(/index\.php\?type=(\d+)/);
    const name = $(el).text().trim();
    if (match && name) {
      categories.set(Number(match[1]), name);
    }
  });

  log(`Discovered ${categories.size} categories`);
  return categories;
}

export async function scrapeCategories(): Promise<Category[]> {
  const discoveredCategories = await discoverCategories();
  const categories: Category[] = [];

  const queue = new PQueue({
    concurrency: CONCURRENCY,
    interval: DELAY_MS,
    intervalCap: CONCURRENCY,
  });

  for (const [id, name] of discoveredCategories) {
    queue.add(async () => {
      log(`Scraping category: ${name} (ID ${id})...`);
      let locationCount = 0;

      try {
        const html = await fetchPageWithRetry(
          `${BASE_URL}/index.php?type=${id}`,
        );
        const $ = cheerio.load(html);
        const locationLinks = new Set<string>();
        $('a[href*="location.php?location="]').each((_, el) => {
          const href = $(el).attr("href");
          if (href) locationLinks.add(href);
        });
        locationCount = locationLinks.size;
      } catch (error_) {
        error(`Failed to scrape category ${name}:`, error_);
      }

      categories.push({
        id,
        slug: makeSlug(name),
        name,
        locationCount,
      });
    });
  }

  await queue.onIdle();

  categories.sort((a, b) => a.id - b.id);

  const outputPath = await writeJSON("categories.json", categories);
  log(`\nWrote ${categories.length} categories to ${outputPath}`);

  return categories;
}

// Run directly if executed as a script
const isMain =
  process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  scrapeCategories();
}
