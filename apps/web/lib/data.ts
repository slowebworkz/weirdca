import { cache } from "react";
import { readFile } from "node:fs/promises";
import path from "node:path";
import type { Category, Location } from "@repo/types";

const DATA_DIR = path.join(process.cwd(), "../scraper/data");

export const getLocations = cache(async (): Promise<Location[]> => {
  const raw = await readFile(path.join(DATA_DIR, "locations.json"), "utf8");
  return JSON.parse(raw) as Location[];
});

export const getLocationBySlug = async (
  slug: string,
): Promise<Location | undefined> => {
  const locations = await getLocations();
  return locations.find((l) => l.slug === slug);
};

export const getCategories = cache(async (): Promise<Category[]> => {
  const raw = await readFile(path.join(DATA_DIR, "categories.json"), "utf8");
  return JSON.parse(raw) as Category[];
});

export const getCategoryByName = async (
  name: string,
): Promise<Category | undefined> => {
  const categories = await getCategories();
  return categories.find((c) => c.name.toLowerCase() === name.toLowerCase());
};
