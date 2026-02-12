export const metadata = {
  title: "Map",
};

export default function MapPage() {
  // TODO: Interactive map with all locations plotted
  // Will use Leaflet or Mapbox GL JS as a client component
  return (
    <div>
      <h1 className="text-3xl font-bold">All Locations</h1>
      <p className="mt-4 text-gray-600">Interactive map placeholder.</p>
      <div className="mt-6 h-[600px] rounded-lg bg-gray-100" />
    </div>
  );
}
