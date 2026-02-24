import Link from "next/link";
import { getLocations } from "@/lib";
import { LocationCard } from "../../components/LocationCard";

interface Props {
  params: Promise<{ county: string }>;
}

export async function generateMetadata({ params }: Props) {
  const { county } = await params;
  return { title: `${decodeURIComponent(county)} County` };
}

export default async function CountyPage({ params }: Props) {
  const { county } = await params;
  const name = decodeURIComponent(county);

  const locations = await getLocations();
  const countyLocations = locations.filter((l) => l.location?.county === name);

  return (
    <div className="col-span-full py-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/county" className="hover:text-red-400">
          Counties
        </Link>
        {" / "}
        <span className="text-gray-300">{name} County</span>
      </nav>

      <h1 className="text-4xl font-bold text-white">{name} County</h1>

      {countyLocations.length > 0 ? (
        <>
          <p className="mt-3 text-gray-400">
            {countyLocations.length} weird{" "}
            {countyLocations.length === 1 ? "location" : "locations"} found.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {countyLocations.map((location) => (
              <LocationCard key={location.slug} location={location} />
            ))}
          </div>
        </>
      ) : (
        <p className="mt-6 text-gray-500">
          No locations found for {name} County.
        </p>
      )}
    </div>
  );
}
