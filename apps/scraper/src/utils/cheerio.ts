import type { CheerioAPI } from "cheerio";

export type $ = CheerioAPI;

/** Safely extract a regex capture group, trimmed, with a fallback. */
export function captureGroup(
  match: RegExpMatchArray | null,
  index: number,
  fallback = "",
): string {
  return (match?.[index] ?? fallback).trim();
}

/** Strip HTML tags from a string. */
export function stripHtml(str: string): string {
  return str.replace(/<[^>]*>/g, "");
}
