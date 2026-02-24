import { Hero } from "./components/index";
import { IntroParagraph } from "./_home/IntroParagraph";

export default function Home() {
  return (
    <>
      <Hero className="[grid-area:hero]" />

      <IntroParagraph />

      {/* <section className="col-span-full mt-12 hidden">
        <h2 className="text-2xl font-semibold text-white">Featured Locations</h2>
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-950"
            >
              <div className="aspect-4/3 bg-gray-900" />
              <div className="flex flex-col gap-2 p-4">
                <div className="h-3 w-16 rounded bg-gray-800" />
                <div className="h-4 w-3/4 rounded bg-gray-800" />
                <div className="h-3 w-1/2 rounded bg-gray-800" />
              </div>
            </div>
          ))}
        </div>
      </section> */}

      {/* <section className="col-span-full mt-16 hidden">
        <h2 className="text-2xl font-semibold text-white">Browse by Category</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((name) => (
            <Link
              key={name}
              href={`/category/${name.toLowerCase().replaceAll(/\s+/g, "-")}`}
              className="flex items-center justify-between rounded-lg border border-gray-800 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-red-800 hover:text-red-400"
            >
              {name}
            </Link>
          ))}
        </div>
      </section> */}

      {/* <section className="col-span-full mt-16 mb-12 hidden">
        <h2 className="text-2xl font-semibold text-white">Browse by County</h2>
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {COUNTIES.map((county) => (
            <Link
              key={county}
              href={`/county/${encodeURIComponent(county)}`}
              className="rounded-lg border border-gray-800 px-4 py-3 text-sm text-gray-300 transition-colors hover:border-red-800 hover:text-red-400"
            >
              {county} County
            </Link>
          ))}
        </div>
      </section> */}
    </>
  );
}
