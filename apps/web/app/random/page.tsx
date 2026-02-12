import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default function RandomPage() {
  // TODO: Load all location slugs and pick one at random
  const slugs = ["santa-claus-oxnard", "megamouth-shark-los-angeles"];
  const randomSlug = slugs[Math.floor(Math.random() * slugs.length)];

  redirect(`/location/${randomSlug}`);
}
