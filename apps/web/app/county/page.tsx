import Link from "next/link";
import { getLocations } from "@/lib";
import type { Location } from "@repo/types";

export const metadata = {
  title: "Counties",
};

export default async function CountiesPage() {
  const locations = await getLocations();

  const counties = (() => {
    type County = Location extends { location?: { county?: infer C } }
      ? C
      : never;

    const seen = new Set<County>();
    for (const loc of locations) {
      const county = loc?.location?.county;
      if (county) seen.add(county as County);
    }
    return [...seen].toSorted();
  })();

  return (
    <div className="col-span-full py-8">
      <h1 className="text-4xl font-bold text-white">Counties</h1>
      <p className="mt-3 text-gray-400">
        Browse weird California attractions by county.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {counties.map((county) => (
          <Link
            key={county}
            href={`/county/${encodeURIComponent(county)}`}
            className="rounded-lg border border-gray-800 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-red-800 hover:text-red-400"
          >
            {county} County
          </Link>
        ))}
      </div>
    </div>
  );
}
