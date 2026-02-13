import { describe, expect, it } from "vitest";
import { parseComment } from "./comment";

describe("parseComment", () => {
  it("parses comment with name, city, state, and date", () => {
    const result = parseComment(
      "John of San Francisco, CA on 2023-05-14 said: Great place to visit!"
    );
    expect(result).toEqual({
      name: "John",
      city: "San Francisco",
      state: "CA",
      text: "Great place to visit!",
      date: "2023-05-14",
    });
  });

  it("parses comment without city (anonymous pattern)", () => {
    const result = parseComment(
      "Anonymous on 2022-01-01 said: Interesting location."
    );
    expect(result).toEqual({
      name: "Anonymous",
      city: null,
      state: null,
      text: "Interesting location.",
      date: "2022-01-01",
    });
  });

  it("returns null for unrecognized format", () => {
    expect(parseComment("Just some random text")).toBeNull();
    expect(parseComment("")).toBeNull();
  });

  it("handles multiline comment text", () => {
    const result = parseComment(
      "Jane of Los Angeles, CA on 2021-06-15 said: First line.\nSecond line.\nThird line."
    );
    expect(result).not.toBeNull();
    expect(result!.text).toBe("First line.\nSecond line.\nThird line.");
  });

  it("handles city names with multiple words", () => {
    const result = parseComment(
      "Bob of San Luis Obispo, CA on 2020-03-10 said: Nice spot."
    );
    expect(result).toEqual({
      name: "Bob",
      city: "San Luis Obispo",
      state: "CA",
      text: "Nice spot.",
      date: "2020-03-10",
    });
  });

  it("handles name with spaces in no-city pattern", () => {
    const result = parseComment(
      "John Smith on 2023-01-01 said: Hello world"
    );
    expect(result).toEqual({
      name: "John Smith",
      city: null,
      state: null,
      text: "Hello world",
      date: "2023-01-01",
    });
  });
});
