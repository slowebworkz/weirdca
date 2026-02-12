interface Props {
  params: Promise<{ county: string }>;
}

export default async function CountyPage({ params }: Props) {
  const { county } = await params;

  // TODO: Load locations for this county
  return (
    <div>
      <h1 className="text-3xl font-bold">{decodeURIComponent(county)} County</h1>
      <p className="mt-4 text-gray-600">County listing placeholder.</p>
    </div>
  );
}
