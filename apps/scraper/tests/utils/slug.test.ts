import { describe, expect, it } from "vitest";
import { makeSlug } from "../../src/utils/slug";

describe("makeSlug", () => {
  it("converts a simple string to a slug", () => {
    expect(makeSlug("Mystery Spot")).toBe("mystery-spot");
  });

  it("combines input with city", () => {
    expect(makeSlug("Mystery Spot", "Santa Cruz")).toBe(
      "mystery-spot-santa-cruz",
    );
  });

  it("strips special characters", () => {
    expect(makeSlug("Bob's Big Boy!")).toBe("bobs-big-boy");
  });

  it("handles empty string", () => {
    expect(makeSlug("")).toBe("");
  });

  it("collapses multiple spaces and hyphens", () => {
    expect(makeSlug("The   Big   House")).toBe("the-big-house");
  });
});
