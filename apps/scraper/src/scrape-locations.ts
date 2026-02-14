import type { Location } from "@repo/types";
import { parseLocationPage } from "./parsers";
import {
  BASE_URL,
  DELAY_MS,
  error,
  fetchPage,
  log,
  sleep,
  writeJSON,
} from "./utils";

async function scrapeLocation(id: number): Promise<Location | null> {
  try {
    const html = await fetchPage(`${BASE_URL}/location.php?location=${id}`);
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

  for (let id = 1; id <= MAX_ID; id++) {
    const location = await scrapeLocation(id);
    if (location) {
      locations.push(location);
      log(`[${id}/${MAX_ID}] ${location.title}`);
    }
    await sleep(DELAY_MS);
  }

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
