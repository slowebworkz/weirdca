import type { SetNonNullable } from "type-fest";

import type { Location } from "./location";

type CoordinateKeys = "latitude" | "longitude";

/** A Location with guaranteed non-null coordinates. */
export type GeocodedLocation = SetNonNullable<Location, CoordinateKeys>;
