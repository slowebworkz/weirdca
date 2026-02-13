import type { ReadonlyDeep } from "type-fest";

import type { Location } from "./location";
import type { LocationSummary } from "./related";

/** Deeply immutable Location for read-only data consumers. */
export type ReadonlyLocation = ReadonlyDeep<Location>;

/** Deeply immutable LocationSummary for read-only data consumers. */
export type ReadonlyLocationSummary = ReadonlyDeep<LocationSummary>;
