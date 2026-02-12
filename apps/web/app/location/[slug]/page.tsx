interface Props {
  params: Promise<{ slug: string }>;
}

export default async function LocationPage({ params }: Props) {
  const { slug } = await params;

  // TODO: Load location data from JSON/DB by slug
  return (
    <div>
      <h1 className="text-3xl font-bold">Location: {slug}</h1>
      <p className="mt-4 text-gray-600">Location detail page placeholder.</p>
    </div>
  );
}
