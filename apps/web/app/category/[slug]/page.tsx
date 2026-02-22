import Link from "next/link";

interface Props {
  params: Promise<{ slug: string }>;
}

function slugToTitle(slug: string) {
  return slug.replaceAll("-", " ").replaceAll(/\b\w/g, (c) => c.toUpperCase());
}

export async function generateMetadata({ params }: Props) {
  const { slug } = await params;
  return { title: slugToTitle(slug) };
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const title = slugToTitle(slug);

  return (
    <div className="col-span-full py-8">
      <nav className="mb-6 text-sm text-gray-500">
        <Link href="/category" className="hover:text-red-400">
          Categories
        </Link>
        {" / "}
        <span className="text-gray-300">{title}</span>
      </nav>

      <h1 className="text-4xl font-bold text-white">{title}</h1>

      <div className="mt-10 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
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
    </div>
  );
}
