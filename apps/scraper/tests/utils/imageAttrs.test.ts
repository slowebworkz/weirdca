import { describe, expect, it } from "vitest";
import { load } from "cheerio";
import { imageAttrs } from "@scraper/utils";

function $(html: string) {
  return load(html);
}

describe("imageAttrs", () => {
  it("extracts image attributes from picture divs", () => {
    const page = $(`
      <div class="picture">
        <a data-lightbox="weirdpict" href="photos/pic1.jpg">
          <img src="photos/thumb1.jpg" alt="Photo 1" width="150" height="100" />
        </a>
        <div class="caption">A caption</div>
      </div>
    `);
    const results = [...imageAttrs(page('div[class^="picture"]'))];
    expect(results).toHaveLength(1);
    expect(results[0]).toMatchObject({
      src: "https://www.weirdca.com/photos/pic1.jpg",
      href: "photos/pic1.jpg",
      alt: "Photo 1",
      caption: "A caption",
      thumbnailSrc: "https://www.weirdca.com/photos/thumb1.jpg",
      position: "left",
      width: 150,
      height: 100,
    });
  });

  it("detects position from class name", () => {
    const page = $(`
      <div class="pictureright">
        <a data-lightbox="weirdpict" href="p.jpg"><img alt="R" /></a>
      </div>
      <div class="picturecenter">
        <a data-lightbox="weirdpict" href="q.jpg"><img alt="C" /></a>
      </div>
      <div class="picture">
        <a data-lightbox="weirdpict" href="r.jpg"><img alt="L" /></a>
      </div>
    `);
    const results = [...imageAttrs(page('div[class^="picture"]'))];
    expect(results[0]!.position).toBe("right");
    expect(results[1]!.position).toBe("center");
    expect(results[2]!.position).toBe("left");
  });

  it("yields null for containers without lightbox links", () => {
    const page = $(`
      <div class="picture"><p>No image here</p></div>
    `);
    const results = [...imageAttrs(page('div[class^="picture"]'))];
    expect(results).toEqual([null]);
  });

  it("handles multiple containers (variadic)", () => {
    // imageAttrs flattens containers sequentially — dedup is the caller's job
    const page = $(`
      <div class="picture">
        <a data-lightbox="weirdpict" href="a.jpg"><img alt="A" /></a>
      </div>
      <div class="picture">
        <a data-lightbox="weirdpict" href="b.jpg"><img alt="B" /></a>
      </div>
    `);
    const first = page('div[class^="picture"]').eq(0);
    const second = page('div[class^="picture"]').eq(1);
    const results = [...imageAttrs(first, second)];
    expect(results).toHaveLength(2);
    expect(results[0]!.href).toBe("a.jpg");
    expect(results[1]!.href).toBe("b.jpg");
  });

  it("returns empty for no containers", () => {
    const page = $("<div></div>");
    const results = [...imageAttrs(page('div[class^="picture"]'))];
    expect(results).toEqual([]);
  });

  it("uses title attr as fallback for alt", () => {
    const page = $(`
      <div class="picture">
        <a data-lightbox="weirdpict" href="x.jpg"><img title="Title fallback" /></a>
      </div>
    `);
    const results = [...imageAttrs(page('div[class^="picture"]'))];
    expect(results[0]!.alt).toBe("Title fallback");
  });

  it("returns null dimensions when not present", () => {
    const page = $(`
      <div class="picture">
        <a data-lightbox="weirdpict" href="x.jpg"><img alt="No dims" /></a>
      </div>
    `);
    const results = [...imageAttrs(page('div[class^="picture"]'))];
    expect(results[0]!.width).toBeNull();
    expect(results[0]!.height).toBeNull();
    expect(results[0]!.thumbnailSrc).toBeNull();
  });
});
