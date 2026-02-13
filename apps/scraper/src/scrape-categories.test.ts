import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("./utils", () => ({
  BASE_URL: "https://www.weirdca.com",
  DELAY_MS: 0,
  fetchPage: vi.fn(),
  makeSlug: vi.fn((name: string) => name.toLowerCase().replace(/\s+/g, "-")),
  sleep: vi.fn().mockResolvedValue(undefined),
  writeJSON: vi.fn().mockResolvedValue("/data/categories.json"),
}));

import { scrapeCategories } from "./scrape-categories";
import { fetchPage } from "./utils";

const mockFetchPage = vi.mocked(fetchPage);

const HOMEPAGE_HTML = `<html><body>
  <a href="index.php?type=19">Animals</a>
  <a href="index.php?type=5">Bizarre Buildings</a>
</body></html>`;

function categoryPageHTML(locationCount: number): string {
  const links = Array.from({ length: locationCount }, (_, i) =>
    `<a href="location.php?location=${i + 1}">Location ${i + 1}</a>`
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
      .mockResolvedValueOnce(categoryPageHTML(3)) // Animals page
      .mockResolvedValueOnce(categoryPageHTML(5)); // Bizarre Buildings page

    const result = await scrapeCategories();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 19,
      name: "Animals",
      locationCount: 3,
    });
    expect(result[1]).toMatchObject({
      id: 5,
      name: "Bizarre Buildings",
      locationCount: 5,
    });
  });

  it("handles fetch errors for individual category pages gracefully", async () => {
    mockFetchPage
      .mockResolvedValueOnce(HOMEPAGE_HTML)
      .mockRejectedValueOnce(new Error("Network error")) // Animals fails
      .mockResolvedValueOnce(categoryPageHTML(2)); // Bizarre Buildings OK

    const result = await scrapeCategories();

    expect(result).toHaveLength(2);
    expect(result[0]).toMatchObject({
      id: 19,
      name: "Animals",
      locationCount: 0, // failed, defaults to 0
    });
    expect(result[1]).toMatchObject({
      id: 5,
      name: "Bizarre Buildings",
      locationCount: 2,
    });
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
