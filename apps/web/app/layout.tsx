import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
import { SiteLogo } from "./components/site-logo";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Weird California",
    template: "%s | Weird California",
  },
  description:
    "Documenting the strange, supernatural, and unconventional attractions across California.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} font-sans antialiased`}>
        <header className="border-b border-gray-800 bg-gray-950">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <SiteLogo size="sm" />
            <div className="flex gap-6 text-sm text-gray-300">
              <Link
                href="/map"
                className="transition-colors hover:text-red-400"
              >
                Map
              </Link>
              <Link
                href="/search"
                className="transition-colors hover:text-red-400"
              >
                Search
              </Link>
              <Link
                href="/random"
                className="transition-colors hover:text-red-400"
              >
                Random
              </Link>
            </div>
          </nav>
        </header>
        <main className="mx-auto max-w-7xl px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
