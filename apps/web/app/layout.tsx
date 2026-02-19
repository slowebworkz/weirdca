import { spaceGrotesk } from "@/fonts";
import { buildMetadata } from "@/lib";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import type { JSX, ReactNode } from "react";
import { SiteLogo } from "./components/site-logo";
import "./globals.css";
import styles from "./layout.module.css";
import { PageHeader } from "./page/PageHeader";

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
}>): JSX.Element {
  const t = useTranslations("page");

  return (
    <html lang="en">
      <body className={`${spaceGrotesk.variable}`} suppressHydrationWarning>
        <PageHeader topNavigationLabel={t("top_navigation")}>
          <SiteLogo size="sm" />
        </PageHeader>
        <main className={`${styles.main} max-w-content px-6 py-8`}>
          {children}
        </main>
      </body>
    </html>
  );
}
