export const metadata = {
  title: "Resources",
};

const RESOURCES = [
  {
    label: "Our Store",
    href: "https://www.cafepress.com/weirdca",
    description: "Weird California merchandise on CafePress.",
  },
  {
    label: "Facebook",
    href: "https://www.facebook.com/WeirdCalifornia",
    description: "Follow us on Facebook.",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/weirdca",
    description: "Photos and updates on Instagram.",
  },
  {
    label: "Twitter / X",
    href: "https://twitter.com/Weird_CA",
    description: "Short updates and links on Twitter.",
  },
  {
    label: "RSS Feed",
    href: "https://www.weirdca.com/feed/",
    description: "Subscribe to new content via RSS.",
  },
  {
    label: "Weird Books",
    href: "https://www.weirdca.com/weird-books/",
    description: "Books about weird and unusual California.",
  },
  {
    label: "Bibliography",
    href: "https://www.weirdca.com/bibliography/",
    description: "Reference materials and sources used on this site.",
  },
  {
    label: "Contact Weird CA",
    href: "https://www.weirdca.com/contact/",
    description: "Get in touch with the Weird CA team.",
  },
];

export default function ResourcesPage() {
  return (
    <div className="col-span-full py-8">
      <h1 className="text-4xl font-bold text-white">Resources</h1>
      <p className="mt-3 text-gray-400">
        Links, social media, merchandise, and reference materials.
      </p>
      <ul className="mt-10 divide-y divide-gray-800">
        {RESOURCES.map(({ label, href, description }) => (
          <li key={href}>
            <a
              href={href}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-between py-4 text-gray-300 transition-colors hover:text-red-400"
            >
              <div>
                <span className="font-medium">{label}</span>
                <p className="mt-0.5 text-sm text-gray-500">{description}</p>
              </div>
              <span className="ml-4 text-gray-600">↗</span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
