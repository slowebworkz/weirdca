export const metadata = {
  title: "Search",
};

export default function SearchPage() {
  // TODO: Client-side search with Fuse.js over all locations
  return (
    <div>
      <h1 className="text-3xl font-bold">Search</h1>
      <input
        type="search"
        placeholder="Search locations..."
        className="mt-6 w-full max-w-lg rounded-lg border border-gray-300 px-4 py-3 text-lg"
      />
      <p className="mt-4 text-gray-600">Search results placeholder.</p>
    </div>
  );
}
