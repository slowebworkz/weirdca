import { bodyText } from "@/fonts";
import { buildMetadata } from "@/lib";
import navEntries from "@/lib/nav.json" with { type: "json" };
import { PageLayout } from "@repo/ui/page";
import type { Metadata } from "next";
import { useTranslations } from "next-intl";
import { getTranslations } from "next-intl/server";
import Link from "next/link";
import type { JSX, ReactNode } from "react";
import "./globals.css";

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
  const tSite = useTranslations("site");

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={bodyText.variable} suppressHydrationWarning>
        <PageLayout id="root">
          <PageLayout.Header className="bg-page-header text-white">
            <PageLayout.TopNav
              aria-label={t("top_navigation")}
              linkAs={Link}
              links={navEntries}
              className="order-2"
            >
              <PageLayout.Logo
                linkAs={Link}
                link="/"
                caption={`${tSite("name")} Home`}
                src={tSite("logo")}
                alt={tSite("name")}
              />
            </PageLayout.TopNav>
          </PageLayout.Header>
          <PageLayout.Content>{children}</PageLayout.Content>
        </PageLayout>
      </body>
    </html>
  );
}
