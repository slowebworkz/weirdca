/** Lightweight representation used in nearby/related listings. */
export interface RelatedLocation {
  id: number;
  slug: string;
  title: string;
  city: string;
  distanceMiles: number;
}

/** Compact summary for category/county listing pages. */
export interface LocationSummary {
  id: number;
  slug: string;
  title: string;
  city: string;
  county: string;
  category: string;
  summary: string;
  thumbnailSrc: string | null;
}
