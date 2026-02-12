import type { Metadata } from "next";
import localFont from "next/font/local";
import Link from "next/link";
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
        <header className="border-b border-gray-200 bg-white">
          <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
            <Link href="/" className="text-xl font-bold tracking-tight">
              Weird California
            </Link>
            <div className="flex gap-6 text-sm">
              <Link href="/map" className="hover:underline">
                Map
              </Link>
              <Link href="/search" className="hover:underline">
                Search
              </Link>
              <Link href="/random" className="hover:underline">
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
