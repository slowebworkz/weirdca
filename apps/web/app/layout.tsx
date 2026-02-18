import { spaceGrotesk } from "@/fonts";
import { buildMetadata } from "@/lib";
import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { ReactNode } from "react";
import { SiteLogo } from "./components/site-logo";
import "./globals.css";
import navEntries from "./nav.json" with { type: "json" };

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");
  return buildMetadata({
    name: t("name"),
    description: t("tagline"),
    twitter: t("twitter"),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });
}

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable}`} suppressHydrationWarning>
        <header className="border-b border-gray-800 bg-gray-950">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <SiteLogo size="sm" />
            <div className="flex gap-6 text-sm text-gray-300">
              {navEntries.map(({ label, href }) => (
                <Link
                  key={href}
                  href={href}
                  className="transition-colors hover:text-red-400"
                >
                  {label}
                </Link>
              ))}
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
