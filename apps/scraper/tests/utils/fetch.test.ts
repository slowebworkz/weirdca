import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import {
  fetchPage,
  fetchPageWithRetry,
  sleep,
  writeJSON,
} from "@scraper/utils/fetch";

vi.mock("node:fs/promises", () => ({
  mkdir: vi.fn().mockResolvedValue(),
  writeFile: vi.fn().mockResolvedValue(),
}));

describe("fetchPage", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns response text on success", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("<html>Hello</html>"),
    } as Response);

    const result = await fetchPage("https://example.com");
    expect(result).toBe("<html>Hello</html>");
    expect(mockFetch).toHaveBeenCalledWith("https://example.com");
  });

  it("throws on non-ok response", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: false,
      status: 404,
    } as Response);

    await expect(fetchPage("https://example.com/missing")).rejects.toThrow(
      "HTTP 404",
    );
  });
});

describe("fetchPageWithRetry", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn());
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("returns response text on success without retrying", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockResolvedValue({
      ok: true,
      text: () => Promise.resolve("<html>OK</html>"),
    } as Response);

    const result = await fetchPageWithRetry("https://example.com");
    expect(result).toBe("<html>OK</html>");
    expect(mockFetch).toHaveBeenCalledTimes(1);
  });

  it("retries on transient failure and succeeds", async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch
      .mockRejectedValueOnce(new Error("Network error"))
      .mockResolvedValueOnce({
        ok: true,
        text: () => Promise.resolve("<html>OK</html>"),
      } as Response);

    const result = await fetchPageWithRetry("https://example.com");
    expect(result).toBe("<html>OK</html>");
    expect(mockFetch).toHaveBeenCalledTimes(2);
  });

  it("throws after exhausting retries", { timeout: 15_000 }, async () => {
    const mockFetch = vi.mocked(fetch);
    mockFetch.mockRejectedValue(new Error("Network error"));

    await expect(
      fetchPageWithRetry("https://example.com/down"),
    ).rejects.toThrow("Network error");
    expect(mockFetch).toHaveBeenCalledTimes(4); // 1 initial + 3 retries
  });
});

describe("sleep", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("resolves after the specified delay", async () => {
    const promise = sleep(500);
    vi.advanceTimersByTime(500);
    await expect(promise).resolves.toBeUndefined();
  });
});

describe("writeJSON", () => {
  it("writes JSON to the data directory", async () => {
    const fs = await import("node:fs/promises");
    const data = { test: true };

    const result = await writeJSON("test.json", data);

    expect(fs.mkdir).toHaveBeenCalled();
    expect(fs.writeFile).toHaveBeenCalledWith(
      expect.stringContaining("test.json"),
      JSON.stringify(data, null, 2),
    );
    expect(result).toContain("test.json");
  });
});
