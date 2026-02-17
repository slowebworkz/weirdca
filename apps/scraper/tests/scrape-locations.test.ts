import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@scraper/utils", () => ({
  BASE_URL: "https://www.weirdca.com",
  CONCURRENCY: 1,
  DELAY_MS: 0,
  fetchPageWithRetry: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
  makeSlug: vi.fn((name: string) => name.toLowerCase().replace(/\s+/g, "-")),
  sleep: vi.fn().mockResolvedValue(undefined),
  writeJSON: vi.fn().mockResolvedValue("/data/locations.json"),
}));

vi.mock("@scraper/parsers", () => ({
  parseLocationPage: vi.fn(),
}));

import { scrapeLocations } from "@scraper/scrape-locations";
import { fetchPageWithRetry } from "@scraper/utils";
import { parseLocationPage } from "@scraper/parsers";
import type { Location } from "@repo/types";

const mockFetchPage = vi.mocked(fetchPageWithRetry);
const mockParseLocationPage = vi.mocked(parseLocationPage);

const fakeLocation: Location = {
  id: 1,
  slug: "mystery-spot-santa-cruz",
  title: "Mystery Spot",
  location: {
    address: "465 Mystery Spot Rd",
    city: "Santa Cruz",
    county: "Santa Cruz",
    state: "California",
    zip: "95065",
    geo: { latitude: 37.0042, longitude: -122.0024 },
  },
  category: "Roadside Attractions",
  subcategory: null,
  description: "A gravitational anomaly.",
  images: [],
  relatedLocations: [],
  comments: [],
  outsideLinks: [],
  outsideReferences: [],
  dateCreated: "2005-03-12",
  dateEdited: "2023-08-01",
};

describe("scrapeLocations", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default: all fetches succeed, all parses return null (no location at that ID)
    mockFetchPage.mockResolvedValue("<html></html>");
    mockParseLocationPage.mockReturnValue(null);
  });

  it("collects successfully parsed locations", async () => {
    // Location at ID 1 exists, IDs 2-1235 return null
    mockParseLocationPage.mockReturnValueOnce(fakeLocation);

    const result = await scrapeLocations();

    expect(result).toHaveLength(1);
    expect(result[0]).toEqual(fakeLocation);
  });

  it("skips locations that fail to fetch", async () => {
    mockFetchPage
      .mockRejectedValueOnce(new Error("404")) // ID 1 fails
      .mockResolvedValue("<html></html>"); // rest succeed but parse to null

    const result = await scrapeLocations();
    expect(result).toEqual([]);
  });

  it("continues scraping after individual failures", async () => {
    mockFetchPage
      .mockRejectedValueOnce(new Error("Network error")) // ID 1 fails
      .mockResolvedValue("<html></html>"); // rest succeed

    // ID 2 parses successfully
    mockParseLocationPage
      .mockReturnValueOnce(null) // never called for ID 1 (fetch failed)
      .mockReturnValueOnce({ ...fakeLocation, id: 2 });

    const result = await scrapeLocations();
    expect(result).toHaveLength(1);
    expect(result[0]!.id).toBe(2);
  });
});
