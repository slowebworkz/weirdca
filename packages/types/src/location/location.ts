import type { Comment } from "../comment";

import type { RelatedLocation } from "./related";

export interface LocationImage {
  readonly src: string;
  readonly href: string;
  readonly alt: string;
  readonly caption: string | null;
  readonly thumbnailSrc: string | null;
  readonly position: "left" | "right" | "center" | null;
  readonly width: number | null;
  readonly height: number | null;
}

export interface Geo {
  readonly latitude: number;
  readonly longitude: number;
}

export interface LocationDetails {
  readonly address?: string;
  readonly city: string;
  readonly county?: string;
  readonly state: string;
  readonly zip?: string;
  readonly geo?: Geo;
}

export interface OutsideLink {
  readonly url: string;
  readonly title: string;
}

export interface OutsideReference {
  readonly url: string;
  readonly title: string;
  readonly year?: number;
  readonly author?: string;
  readonly pages?: string;
}

export interface Location {
  readonly id: number;
  readonly slug: string;
  readonly title: string;
  readonly location?: LocationDetails;
  readonly category: string;
  readonly subcategory: string | null;
  readonly description: string;
  readonly images: readonly LocationImage[];
  readonly relatedLocations: readonly RelatedLocation[];
  readonly comments: readonly Comment[];
  readonly outsideLinks: readonly OutsideLink[];
  readonly outsideReferences: readonly OutsideReference[];
  readonly dateCreated: string;
  readonly dateEdited: string;
}
