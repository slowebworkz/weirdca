import type { Location } from "@repo/types";
import { parseLocationPage } from "@scraper/parsers";
import {
  BASE_URL,
  CONCURRENCY,
  DELAY_MS,
  error,
  fetchPageWithRetry,
  log,
  writeJSON,
} from "@scraper/utils";
import PQueue from "p-queue";

async function scrapeLocation(id: number): Promise<Location | null> {
  try {
    const html = await fetchPageWithRetry(
      `${BASE_URL}/location.php?location=${id}`,
    );
    return parseLocationPage(html, id);
  } catch (err) {
    error(`Failed to scrape location ${id}:`, err);
    return null;
  }
}

export async function scrapeLocations(): Promise<Location[]> {
  const MAX_ID = 1235; // Known max, IDs are sparse
  const locations: Location[] = [];

  log(`Scraping locations 1 through ${MAX_ID}...`);

  const queue = new PQueue({
    concurrency: CONCURRENCY,
    interval: DELAY_MS,
    intervalCap: CONCURRENCY,
  });

  for (let id = 1; id <= MAX_ID; id++) {
    const currentId = id;
    queue.add(async () => {
      const location = await scrapeLocation(currentId);
      if (location) {
        locations.push(location);
        log(`[${currentId}/${MAX_ID}] ${location.title}`);
      }
    });
  }

  await queue.onIdle();

  locations.sort((a, b) => a.id - b.id);

  const outputPath = await writeJSON("locations.json", locations);
  log(`\nDone! Scraped ${locations.length} locations to ${outputPath}`);

  return locations;
}

// Run directly if executed as a script
const isMain =
  process.argv[1] && import.meta.url === `file://${process.argv[1]}`;
if (isMain) {
  scrapeLocations();
}
