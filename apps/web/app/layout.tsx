import { spaceGrotesk } from "@/fonts";
import { buildMetadata } from "@/lib";
import navEntries from "@/lib/nav.json" with { type: "json" };
import { PageHeader } from "@repo/ui/page";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { JSX, ReactNode } from "react";
import { SiteLogo } from "./components/site-logo";
import "./globals.css";
import styles from "./layout.module.css";

type RootLayoutProps = Readonly<{ children: ReactNode }>;

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("site");
  return buildMetadata({
    name: t("name"),
    description: t("tagline"),
    twitter: t("twitter"),
    baseUrl: process.env.NEXT_PUBLIC_BASE_URL,
  });
}

export default function RootLayout({ children }: RootLayoutProps): JSX.Element {
  const t = useTranslations("page");

  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable}`} suppressHydrationWarning>
        <PageHeader
          className={styles.header}
          nav-label={t("top_navigation")}
          logo={<SiteLogo size="md" />}
        >
          <>
            {navEntries.map(({ label, href }, index) => (
              <li key={`${href}${index}`}>
                <Link
                  href={href}
                  className="transition-colors hover:text-red-400"
                >
                  {label}
                </Link>
              </li>
            ))}
          </>
        </PageHeader>

        <main className={`${styles.main} max-w-content px-6 py-8`}>
          {children}
        </main>
      </body>
    </html>
  );
}
