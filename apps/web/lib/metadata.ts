import type { Metadata } from "next";

export type MetadataConfig = {
  name: string;
  description: string;
  twitter: string;
  baseUrl: string | undefined;
};

export function buildMetadata({
  name,
  description,
  twitter,
  baseUrl,
}: MetadataConfig): Metadata {
  return {
    metadataBase: new URL(baseUrl ?? "http://localhost:3000"),
    title: {
      default: name,
      template: `%s | ${name}`,
    },
    description,
    openGraph: {
      siteName: name,
      description,
      type: "website",
      locale: "en_US",
    },
    twitter: {
      card: "summary_large_image",
      site: twitter,
    },
  };
}
