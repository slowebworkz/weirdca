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

export interface LocationImage {
  src: string;
  alt: string;
  width?: number;
  height?: number;
}

export interface RelatedLocation {
  id: number;
  slug: string;
  title: string;
  city: string;
  distanceMiles: number;
}

export interface Comment {
  name: string | null;
  city: string | null;
  state: string | null;
  text: string;
  date: string;
}

export interface Category {
  id: number;
  slug: string;
  name: string;
  locationCount: number;
}

export interface County {
  name: string;
  slug: string;
  cities: string[];
  locationCount: number;
}

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
