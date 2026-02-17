import type { Geo, LocationDetails } from "@repo/types";

export function buildLocationDetails(
  city: string,
  address: string,
  county: string,
  zip: string,
  latStr: string | undefined,
  lngStr: string | undefined,
): LocationDetails | undefined {
  if (!city) return undefined;

  const geo: Geo | undefined =
    latStr && lngStr
      ? {
          latitude: Number.parseFloat(latStr),
          longitude: Number.parseFloat(lngStr),
        }
      : undefined;

  const entries = Object.entries<string | Geo | undefined>({
    address,
    city,
    county,
    state: "California",
    zip,
    geo,
  }).filter(
    (entry): entry is [string, string | Geo] =>
      entry[1] !== undefined && entry[1] !== "",
  );

  return Object.fromEntries(entries) as unknown as LocationDetails;
}
