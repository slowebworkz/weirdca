import type { Comment } from "../comment";

import type { RelatedLocation } from "./related";

export interface LocationImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface Location {
  id: number;
  slug: string;
  title: string;
  address: string;
  city: string;
  county: string;
  state: string;
  zip: string;
  latitude: number | null;
  longitude: number | null;
  category: string;
  subcategory: string | null;
  description: string;
  images: LocationImage[];
  relatedLocations: RelatedLocation[];
  comments: Comment[];
  dateCreated: string;
  dateEdited: string;
}
