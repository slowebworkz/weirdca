import type { Simplify } from "type-fest";

import type { Location } from "./location";

type RelatedLocationKeys = "id" | "slug" | "title" | "city";
type LocationSummaryKeys = "id" | "slug" | "title" | "city" | "county" | "category";

/** Lightweight representation used in nearby/related listings. */
export type RelatedLocation = Simplify<
  Pick<Location, RelatedLocationKeys> & {
    distanceMiles: number;
  }
>;

/** Compact summary for category/county listing pages. */
export type LocationSummary = Simplify<
  Pick<Location, LocationSummaryKeys> & {
    summary: string;
    thumbnailSrc: string | null;
  }
>;
