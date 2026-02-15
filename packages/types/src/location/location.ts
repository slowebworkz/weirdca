import type { Comment } from "../comment";

import type { RelatedLocation } from "./related";

export interface LocationImage {
  src: string;
  alt: string;
  caption: string | null;
  thumbnailSrc: string | null;
  position: "left" | "right" | "center" | null;
  width: number | null;
  height: number | null;
}

export interface Geo {
  latitude: number;
  longitude: number;
}

export interface LocationDetails {
  address?: string;
  city: string;
  county?: string;
  state: string;
  zip?: string;
  geo?: Geo;
}

export interface OutsideLink {
  url: string;
  title: string;
}

export interface OutsideReference {
  url: string;
  title: string;
  year?: number;
  author?: string;
  pages?: string;
}

export interface Location {
  id: number;
  slug: string;
  title: string;
  location?: LocationDetails;
  category: string;
  subcategory: string | null;
  description: string;
  images: LocationImage[];
  relatedLocations: RelatedLocation[];
  comments: Comment[];
  outsideLinks: OutsideLink[];
  outsideReferences: OutsideReference[];
  dateCreated: string;
  dateEdited: string;
}
