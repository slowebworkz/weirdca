import type { Location } from "@repo/types";
import { makeSlug } from "@scraper/utils";
import * as cheerio from "cheerio";
import { buildLocationDetails } from "./build-location-details";
import { parseAddress } from "./parse-address";
import { parseComments } from "./parse-comments";
import { parseCounty } from "./parse-county";
import { parseDates } from "./parse-dates";
import { parseDescription } from "./parse-description";
import { parseImages } from "./parse-images";
import { parseOutsideLinks } from "./parse-outside-links";
import { parseOutsideReferences } from "./parse-outside-references";
import { parseRelatedLocations } from "./parse-related-locations";
import { textTrim } from "@scraper/utils";

export function parseLocationPage(html: string, id: number): Location | null {
  const $ = cheerio.load(html);

  const title = textTrim($("title"))
    ?.replace(/\s*-?\s*Weird California$/, "")
    .trim();
  if (!title) return null;

  const category = textTrim($("#menu h1 a").first());
  const latStr = $('meta[property="og:latitude"]').attr("content");
  const lngStr = $('meta[property="og:longitude"]').attr("content");
  const { addressDiv, address, city, zip } = parseAddress($);
  const county = parseCounty($);
  const { dateCreated, dateEdited } = parseDates($);

  return {
    id,
    slug: makeSlug(title, city),
    title,
    location: buildLocationDetails(city, address, county, zip, latStr, lngStr),
    category,
    subcategory: null,
    description: parseDescription(addressDiv),
    images: parseImages($),
    relatedLocations: parseRelatedLocations($),
    comments: parseComments($),
    outsideLinks: parseOutsideLinks($),
    outsideReferences: parseOutsideReferences($),
    dateCreated,
    dateEdited,
  };
}
