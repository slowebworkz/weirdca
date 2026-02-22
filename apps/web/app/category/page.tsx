import Link from "next/link";

const CATEGORIES = [
  { name: "Roadside Attractions", slug: "roadside-attractions", count: 33 },
  { name: "Hauntings", slug: "hauntings", count: 16 },
  { name: "Bizarre Buildings", slug: "bizarre-buildings", count: 21 },
  { name: "Monsters", slug: "monsters", count: 20 },
  { name: "Legends", slug: "legends", count: 13 },
  { name: "Forgotten Locales", slug: "forgotten-locales", count: 28 },
  { name: "Animals", slug: "animals", count: 18 },
  { name: "History", slug: "history", count: 24 },
  { name: "Natural Weirdness", slug: "natural-weirdness", count: 10 },
  { name: "Missing Treasures", slug: "missing-treasures", count: 8 },
  { name: "Weird", slug: "weird", count: 30 },
  { name: "Seasonal Weird", slug: "seasonal-weird", count: 8 },
  { name: "Haunted Houses", slug: "haunted-houses", count: 20 },
  { name: "Haunted Cemeteries", slug: "haunted-cemeteries", count: 8 },
  { name: "Haunted Bridges", slug: "haunted-bridges", count: 9 },
  { name: "Haunted Roads", slug: "haunted-roads", count: 9 },
  { name: "Haunted Ships", slug: "haunted-ships", count: 7 },
  { name: "Haunted Schools", slug: "haunted-schools", count: 10 },
  { name: "Haunted Businesses", slug: "haunted-businesses", count: 15 },
  { name: "Haunted Lakes", slug: "haunted-lakes", count: 8 },
  { name: "Land of the Giants", slug: "land-of-the-giants", count: 36 },
  { name: "Roadside Dinosaurs", slug: "roadside-dinosaurs", count: 9 },
  { name: "Irregular Residences", slug: "irregular-residences", count: 12 },
  { name: "Atypical Museums", slug: "atypical-museums", count: 9 },
  { name: "Alien Invasion Sites", slug: "alien-invasion-sites", count: 8 },
  { name: "Filming Locations", slug: "filming-locations", count: 8 },
  { name: "Canine Celebrities", slug: "canine-celebrities", count: 11 },
  { name: "Strange Rocks", slug: "strange-rocks", count: 8 },
  { name: "Kilns", slug: "kilns", count: 7 },
  { name: "Windmills", slug: "windmills", count: 6 },
];

export const metadata = {
  title: "Categories",
};

export default function CategoriesPage() {
  return (
    <div className="col-span-full py-8">
      <h1 className="text-4xl font-bold text-white">Categories</h1>
      <p className="mt-3 text-gray-400">
        Browse all {CATEGORIES.length} categories of weird California
        attractions.
      </p>
      <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {CATEGORIES.map(({ name, slug, count }) => (
          <Link
            key={slug}
            href={`/category/${slug}`}
            className="flex items-center justify-between rounded-lg border border-gray-800 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-red-800 hover:text-red-400"
          >
            <span>{name}</span>
            <span className="text-xs text-gray-600">{count}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
