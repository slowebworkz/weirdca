import { describe, expect, it } from "vitest";
import { parseLocationPage } from "@scraper/parsers";

function buildLocationHTML({
  title = "Mystery Spot - Weird California",
  category = "Roadside Attractions",
  cityLink = "Santa Cruz",
  latitude = "37.0042",
  longitude = "-122.0024",
  galleryPath = "gallery/var/albums/Weird/California/Santa-Cruz/",
  description = "<p>The Mystery Spot is a gravitational anomaly.</p><p>Discovered in 1939.</p>",
  images = true,
  relatedLocations = true,
  comments = true,
  outsideLinks = false,
  outsideReferences = false,
  dates = true,
}: Partial<{
  title: string;
  category: string;
  cityLink: string | null;
  latitude: string | null;
  longitude: string | null;
  galleryPath: string;
  description: string;
  images: boolean;
  relatedLocations: boolean;
  comments: boolean;
  outsideLinks: boolean;
  outsideReferences: boolean;
  dates: boolean;
}> = {}): string {
  const metaLat = latitude
    ? `<meta property="og:latitude" content="${latitude}" />`
    : "";
  const metaLng = longitude
    ? `<meta property="og:longitude" content="${longitude}" />`
    : "";

  const cityPart = cityLink
    ? `<a href="search2.php?city=${encodeURIComponent(cityLink)}">${cityLink}</a>, California 95065`
    : "California";

  const imageHTML = images
    ? `<div class=picture><a data-lightbox="weirdpict" href="${galleryPath}photo1.jpg"><img width=150 alt="Photo 1" src="${galleryPath}thumb1.jpg" /></a><div class=caption>First photo</div></div>
       <div class=pictureright><a data-lightbox="weirdpict" href="${galleryPath}photo2.jpg"><img width=200 alt="Photo 2" src="${galleryPath}thumb2.jpg" /></a><div class=caption>Second photo</div></div>`
    : "";

  const relatedHTML = relatedLocations
    ? `<a href="location.php?location=42">
         <div class="nearby"><p>Some Other Spot<br>2.5 Miles Away<br>Nearby City, California</p></div>
       </a>`
    : "";

  const commentsHTML = comments
    ? `<p><b>Comments:</b></p>
       <ul>
         <li>Alice of Monterey, CA on 2023-01-15 said: Amazing place!</li>
       </ul>`
    : "";

  const outsideLinksHTML = outsideLinks
    ? `<p><b>Outside Links:</b></p><ul>
         <li><a href="http://www.mysteryspot.com" target="top">Mystery Spot</a></li>
         <li><a href="http://www.example.com" target="top">Example Site</a></li>
       </ul>`
    : "";

  const outsideRefsHTML = outsideReferences
    ? `<p><b>Outside References:</b></p><ul>
         <li><a href="http://amzn.to/abc" target="top">Weird California</a> (2006) by Greg Bishop, Joe Oesterle, Mike Marinacci, p: 82 - 83</li>
         <li><a href="http://amzn.to/def" target="top">Haunted Monterey Peninsula</a> (2009) by Yasuda, Anita, p: 141 - 144</li>
         <li><a href="http://amzn.to/ghi" target="top">Ghosts of the Queen Mary</a> (2014) by Clune, Brian with Bob Davis</li>
       </ul>`
    : "";

  const datesHTML = dates
    ? `<i>First Created: 2005-03-12 Last Edited: 2023-08-01</i>`
    : "";

  return `<html>
    <head>
      <title>${title}</title>
      ${metaLat}
      ${metaLng}
    </head>
    <body>
      <div id="menu"><h1><a href="index.php?type=11">${category}</a></h1></div>
      <div id="address">465 Mystery Spot Rd, ${cityPart}</div>
      ${imageHTML}
      ${description}
      <div class="follow">Follow us</div>
      ${relatedHTML}
      ${commentsHTML}
      ${outsideLinksHTML}
      ${outsideRefsHTML}
      ${datesHTML}
    </body>
  </html>`;
}

describe("parseLocationPage", () => {
  it("parses a full location page", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 100);

    expect(result).not.toBeNull();
    expect(result!.id).toBe(100);
    expect(result!.title).toBe("Mystery Spot");
    expect(result!.category).toBe("Roadside Attractions");
    expect(result!.location).toBeDefined();
    expect(result!.location!.city).toBe("Santa Cruz");
    expect(result!.location!.state).toBe("California");
    expect(result!.location!.geo).toBeDefined();
    expect(result!.location!.geo!.latitude).toBe(37.0042);
    expect(result!.location!.geo!.longitude).toBe(-122.0024);
    expect(result!.slug).toBeTruthy();
  });

  it("returns null for empty page", () => {
    expect(
      parseLocationPage("<html><head><title></title></head></html>", 1),
    ).toBeNull();
  });

  it("returns null when title is just 'Weird California'", () => {
    const html = "<html><head><title>Weird California</title></head></html>";
    expect(parseLocationPage(html, 1)).toBeNull();
  });

  it("returns null when title is ' - Weird California'", () => {
    const html = "<html><head><title> - Weird California</title></head></html>";
    expect(parseLocationPage(html, 1)).toBeNull();
  });

  it("extracts address and zip", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.location!.zip).toBe("95065");
    expect(result.location!.address).toBeDefined();
  });

  it("extracts county from gallery image path", () => {
    const html = buildLocationHTML({
      galleryPath: "gallery/var/albums/Weird/California/Los-Angeles/",
    });
    const result = parseLocationPage(html, 1)!;
    expect(result.location!.county).toBe("Los Angeles");
  });

  it("handles page with no images", () => {
    const html = buildLocationHTML({ images: false });
    const result = parseLocationPage(html, 1)!;
    expect(result.images).toEqual([]);
    expect(result.location!.county).toBeUndefined();
  });

  it("handles page with no comments", () => {
    const html = buildLocationHTML({ comments: false });
    const result = parseLocationPage(html, 1)!;
    expect(result.comments).toEqual([]);
  });

  it("handles page with no related locations", () => {
    const html = buildLocationHTML({ relatedLocations: false });
    const result = parseLocationPage(html, 1)!;
    expect(result.relatedLocations).toEqual([]);
  });

  it("handles page with no coordinates", () => {
    const html = buildLocationHTML({ latitude: null, longitude: null });
    const result = parseLocationPage(html, 1)!;
    expect(result.location!.geo).toBeUndefined();
  });

  it("handles page with no dates", () => {
    const html = buildLocationHTML({ dates: false });
    const result = parseLocationPage(html, 1)!;
    expect(result.dateCreated).toBe("");
    expect(result.dateEdited).toBe("");
  });

  it("omits location when no city is available", () => {
    const html = buildLocationHTML({ cityLink: null });
    const result = parseLocationPage(html, 1)!;
    expect(result.location).toBeUndefined();
  });

  it("extracts images with full URLs, captions, and positions", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.images).toHaveLength(2);

    expect(result.images[0]).toMatchObject({
      src: "https://www.weirdca.com/gallery/var/albums/Weird/California/Santa-Cruz/photo1.jpg",
      alt: "Photo 1",
      caption: "First photo",
      position: "left",
      width: 150,
    });
    expect(result.images[0]!.thumbnailSrc).toContain("thumb1.jpg");

    expect(result.images[1]).toMatchObject({
      alt: "Photo 2",
      caption: "Second photo",
      position: "right",
      width: 200,
    });
  });

  it("stops description at 'Closest Weird'", () => {
    const html = buildLocationHTML({
      description:
        "<p>First paragraph.</p><p>Closest Weird locations nearby.</p><p>Should not appear.</p>",
    });
    const result = parseLocationPage(html, 1)!;
    expect(result.description).toBe("First paragraph.");
    expect(result.description).not.toContain("Should not appear");
  });

  it("stops description at follow div", () => {
    const html = buildLocationHTML({
      description: "<p>Only paragraph.</p>",
    });
    const result = parseLocationPage(html, 1)!;
    expect(result.description).toBe("Only paragraph.");
  });

  it("parses related locations", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.relatedLocations).toHaveLength(1);
    expect(result.relatedLocations[0]!.id).toBe(42);
    expect(result.relatedLocations[0]!.distanceMiles).toBe(2.5);
    expect(result.relatedLocations[0]!.title).toBe("Some Other Spot");
  });

  it("parses comments", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.comments).toHaveLength(1);
    expect(result.comments[0]!.name).toBe("Alice");
    expect(result.comments[0]!.city).toBe("Monterey");
    expect(result.comments[0]!.text).toBe("Amazing place!");
  });

  it("parses outside links", () => {
    const html = buildLocationHTML({ outsideLinks: true });
    const result = parseLocationPage(html, 1)!;
    expect(result.outsideLinks).toHaveLength(2);
    expect(result.outsideLinks[0]).toEqual({
      url: "http://www.mysteryspot.com",
      title: "Mystery Spot",
    });
    expect(result.outsideLinks[1]).toEqual({
      url: "http://www.example.com",
      title: "Example Site",
    });
  });

  it("returns empty array when no outside links", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.outsideLinks).toEqual([]);
  });

  it("parses outside references with full citation", () => {
    const html = buildLocationHTML({ outsideReferences: true });
    const result = parseLocationPage(html, 1)!;
    expect(result.outsideReferences).toHaveLength(3);
    expect(result.outsideReferences[0]).toEqual({
      url: "http://amzn.to/abc",
      title: "Weird California",
      year: 2006,
      author: "Greg Bishop, Joe Oesterle, Mike Marinacci",
      pages: "82 - 83",
    });
    expect(result.outsideReferences[1]).toMatchObject({
      title: "Haunted Monterey Peninsula",
      year: 2009,
      author: "Yasuda, Anita",
      pages: "141 - 144",
    });
  });

  it("parses outside references without page numbers", () => {
    const html = buildLocationHTML({ outsideReferences: true });
    const result = parseLocationPage(html, 1)!;
    const noPagesRef = result.outsideReferences[2]!;
    expect(noPagesRef.title).toBe("Ghosts of the Queen Mary");
    expect(noPagesRef.year).toBe(2014);
    expect(noPagesRef.author).toBe("Clune, Brian with Bob Davis");
    expect(noPagesRef.pages).toBeUndefined();
  });

  it("returns empty array when no outside references", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.outsideReferences).toEqual([]);
  });

  it("parses dates", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.dateCreated).toBe("2005-03-12");
    expect(result.dateEdited).toBe("2023-08-01");
  });

  it("deduplicates images that appear in both picture divs and lightbox links", () => {
    // The default HTML has lightbox links inside picture divs, so they match
    // both selectors. parseImages should deduplicate by href.
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    const hrefs = result.images.map((img) => img.href);
    const unique = new Set(hrefs);
    expect(hrefs).toHaveLength(unique.size);
  });

  it("returns empty outsideReferences when header exists but no list items", () => {
    const html = buildLocationHTML({}).replace(
      "</body>",
      `<p><b>Outside References:</b></p><ul></ul></body>`,
    );
    const result = parseLocationPage(html, 1)!;
    expect(result.outsideReferences).toEqual([]);
  });
});
