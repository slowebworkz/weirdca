interface Props {
  params: Promise<{ slug: string }>;
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;

  // TODO: Load locations for this category
  return (
    <div>
      <h1 className="text-3xl font-bold">Category: {slug}</h1>
      <p className="mt-4 text-gray-600">Category listing placeholder.</p>
    </div>
  );
}
