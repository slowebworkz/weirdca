import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { textTrim } from "@scraper/utils";

function $(html: string) {
  return load(html);
}

describe("textTrim", () => {
  it("returns trimmed text content", () => {
    const page = $("<p>  Hello World  </p>");
    expect(textTrim(page("p"))).toBe("Hello World");
  });

  it("returns empty string for empty element", () => {
    const page = $("<p></p>");
    expect(textTrim(page("p"))).toBe("");
  });

  it("returns empty string for non-existent selector", () => {
    const page = $("<div></div>");
    expect(textTrim(page("p"))).toBe("");
  });

  it("collapses nested element text", () => {
    const page = $("<div><span>Hello</span> <b>World</b></div>");
    expect(textTrim(page("div"))).toBe("Hello World");
  });

  it("trims leading and trailing whitespace including newlines", () => {
    const page = $("<p>\n  Some text\n  </p>");
    expect(textTrim(page("p"))).toBe("Some text");
  });
});
