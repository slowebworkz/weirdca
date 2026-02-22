import Link from "next/link";
import Image from "next/image";
import type { Location } from "@repo/types";
import type { JSX } from "react";

type Props = {
  location: Pick<
    Location,
    "slug" | "title" | "category" | "description" | "images" | "location"
  >;
};

export function LocationCard({ location }: Props): JSX.Element {
  const thumb =
    location.images.find((img) => img.thumbnailSrc) ?? location.images[0];
  const summary = location.description.slice(0, 120).trimEnd() + "…";
  const place = [location.location?.city, location.location?.county]
    .filter(Boolean)
    .join(", ");

  return (
    <Link
      href={`/location/${location.slug}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-gray-800 bg-gray-950 transition-colors hover:border-red-800"
    >
      <div className="relative aspect-4/3 overflow-hidden bg-gray-900">
        {thumb?.thumbnailSrc ? (
          <Image
            src={thumb.thumbnailSrc}
            alt={thumb.alt}
            fill
            className="object-cover transition-transform group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-gray-700">
            No image
          </div>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <span className="text-xs font-medium uppercase tracking-wide text-red-400">
          {location.category}
        </span>
        <h3 className="font-semibold text-white transition-colors group-hover:text-red-300">
          {location.title}
        </h3>
        {place && <p className="text-xs text-gray-500">{place}</p>}
        <p className="mt-1 line-clamp-3 text-sm text-gray-400">{summary}</p>
      </div>
    </Link>
  );
}
