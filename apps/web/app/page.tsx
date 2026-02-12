export default function Home() {
  return (
    <div>
      <h1 className="text-4xl font-bold tracking-tight">Weird California</h1>
      <p className="mt-4 text-lg text-gray-600">
        Documenting the strange, supernatural, and unconventional attractions
        across California.
      </p>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Categories</h2>
        <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {/* TODO: Load from data */}
          {[
            "Hauntings",
            "Roadside Attractions",
            "Bizarre Buildings",
            "Monsters",
            "Legends",
            "Forgotten Locales",
            "Animals",
            "History",
            "Natural Weirdness",
            "Missing Treasures",
            "Weird",
            "Seasonal Weird",
          ].map((category) => (
            <a
              key={category}
              href={`/category/${category.toLowerCase().replace(/\s+/g, "-")}`}
              className="rounded-lg border border-gray-200 p-4 transition-colors hover:bg-gray-50"
            >
              {category}
            </a>
          ))}
        </div>
      </section>

      <section className="mt-12">
        <h2 className="text-2xl font-semibold">Browse by County</h2>
        <p className="mt-2 text-gray-600">
          Explore all 58 California counties.
        </p>
        {/* TODO: County grid */}
      </section>
    </div>
  );
}
