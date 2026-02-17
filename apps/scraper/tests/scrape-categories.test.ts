import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@scraper/utils", () => ({
  BASE_URL: "https://www.weirdca.com",
  CONCURRENCY: 1,
  DELAY_MS: 0,
  fetchPageWithRetry: vi.fn(),
  log: vi.fn(),
  error: vi.fn(),
  makeSlug: vi.fn((name: string) => name.toLowerCase().replaceAll(/\s+/g, "-")),
  sleep: vi.fn().mockResolvedValue(),
  writeJSON: vi.fn().mockResolvedValue("/data/categories.json"),
}));

import { scrapeCategories } from "@scraper/scrape-categories";
import { fetchPageWithRetry } from "@scraper/utils";

const mockFetchPage = vi.mocked(fetchPageWithRetry);

const HOMEPAGE_HTML = `<html><body>
  <a href="index.php?type=19">Animals</a>
  <a href="index.php?type=5">Bizarre Buildings</a>
</body></html>`;

function categoryPageHTML(locationCount: number): string {
  const links = Array.from(
    { length: locationCount },
    (_, i) => `<a href="location.php?location=${i + 1}">Location ${i + 1}</a>`,
  ).join("\n");
  return `<html><body>${links}</body></html>`;
}

describe("scrapeCategories", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("discovers categories from homepage and scrapes each one", async () => {
    mockFetchPage
      .mockResolvedValueOnce(HOMEPAGE_HTML) // homepage
      .mockResolvedValueOnce(categoryPageHTML(3)) // first category page
      .mockResolvedValueOnce(categoryPageHTML(5)); // second category page

    const result = await scrapeCategories();

    expect(result).toHaveLength(2);
    // Results are sorted by ID, so ID 5 comes first
    expect(result[0]).toMatchObject({
      id: 5,
      name: "Bizarre Buildings",
    });
    expect(result[1]).toMatchObject({
      id: 19,
      name: "Animals",
    });
  });

  it("handles fetch errors for individual category pages gracefully", async () => {
    mockFetchPage
      .mockResolvedValueOnce(HOMEPAGE_HTML)
      .mockRejectedValueOnce(new Error("Network error")) // first category fails
      .mockResolvedValueOnce(categoryPageHTML(2)); // second category OK

    const result = await scrapeCategories();

    expect(result).toHaveLength(2);
    const failed = result.find((c) => c.locationCount === 0);
    const succeeded = result.find((c) => c.locationCount === 2);
    expect(failed).toBeDefined();
    expect(succeeded).toBeDefined();
  });

  it("returns empty array when no categories found on homepage", async () => {
    mockFetchPage.mockResolvedValueOnce("<html><body>No links</body></html>");

    const result = await scrapeCategories();
    expect(result).toEqual([]);
  });

  it("deduplicates categories by ID", async () => {
    const duplicateHTML = `<html><body>
      <a href="index.php?type=19">Animals</a>
      <a href="index.php?type=19">Animals</a>
    </body></html>`;

    mockFetchPage
      .mockResolvedValueOnce(duplicateHTML)
      .mockResolvedValueOnce(categoryPageHTML(1));

    const result = await scrapeCategories();
    expect(result).toHaveLength(1);
  });
});
