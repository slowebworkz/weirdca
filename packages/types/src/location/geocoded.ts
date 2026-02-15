import type { Location, LocationDetails } from "./location";

/** A Location with guaranteed non-null coordinates. */
export type GeocodedLocation = Location & {
  location: LocationDetails & Required<Pick<LocationDetails, "geo">>;
};
