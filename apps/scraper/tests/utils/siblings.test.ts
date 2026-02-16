import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { siblings } from "@scraper/utils";

function $(html: string) {
  return load(html);
}

describe("siblings", () => {
  it("yields all following siblings", () => {
    const page = $("<div><p id='a'>A</p><p id='b'>B</p><p id='c'>C</p></div>");
    const start = page("#a");
    const texts = [...siblings(start)].map((el) => el.text());
    expect(texts).toEqual(["B", "C"]);
  });

  it("yields empty when element has no next siblings", () => {
    const page = $("<div><p>Only</p></div>");
    const start = page("p");
    expect([...siblings(start)]).toEqual([]);
  });

  it("yields mixed tag siblings", () => {
    const page = $(
      "<div><h2>Start</h2><p>Para</p><span>Span</span><div>Div</div></div>",
    );
    const start = page("h2");
    const tags = [...siblings(start)].map((el) => el.prop("tagName"));
    expect(tags).toEqual(["P", "SPAN", "DIV"]);
  });

  it("does not include the start element itself", () => {
    const page = $("<div><p id='start'>Start</p><p>Next</p></div>");
    const start = page("#start");
    const texts = [...siblings(start)].map((el) => el.text());
    expect(texts).not.toContain("Start");
    expect(texts).toEqual(["Next"]);
  });
});
