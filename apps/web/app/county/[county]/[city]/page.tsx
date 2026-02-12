interface Props {
  params: Promise<{ county: string; city: string }>;
}

export default async function CityPage({ params }: Props) {
  const { county, city } = await params;

  // TODO: Load locations for this city
  return (
    <div>
      <h1 className="text-3xl font-bold">{decodeURIComponent(city)}</h1>
      <p className="mt-2 text-gray-500">{decodeURIComponent(county)} County</p>
      <p className="mt-4 text-gray-600">City listing placeholder.</p>
    </div>
  );
}
