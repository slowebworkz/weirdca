import { describe, expect, it } from "vitest";
import { parseLocationPage } from "./location";

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
  dates = true,
}: Partial<{
  title: string;
  category: string;
  cityLink: string;
  latitude: string | null;
  longitude: string | null;
  galleryPath: string;
  description: string;
  images: boolean;
  relatedLocations: boolean;
  comments: boolean;
  dates: boolean;
}> = {}): string {
  const metaLat = latitude
    ? `<meta property="og:latitude" content="${latitude}" />`
    : "";
  const metaLng = longitude
    ? `<meta property="og:longitude" content="${longitude}" />`
    : "";

  const imageHTML = images
    ? `<a data-lightbox="weirdpict" href="${galleryPath}photo1.jpg"><img alt="Photo 1" /></a>
       <a data-lightbox="weirdpict" href="${galleryPath}photo2.jpg"><img alt="Photo 2" /></a>`
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
      <div id="address">465 Mystery Spot Rd, <a href="search2.php?city=${encodeURIComponent(cityLink)}">${cityLink}</a>, California 95065</div>
      ${imageHTML}
      ${description}
      <div class="follow">Follow us</div>
      ${relatedHTML}
      ${commentsHTML}
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
    expect(result!.city).toBe("Santa Cruz");
    expect(result!.state).toBe("California");
    expect(result!.latitude).toBe(37.0042);
    expect(result!.longitude).toBe(-122.0024);
    expect(result!.slug).toBeTruthy();
  });

  it("returns null for empty page", () => {
    expect(parseLocationPage("<html><head><title></title></head></html>", 1)).toBeNull();
  });

  it("returns null when title is just 'Weird California'", () => {
    const html = "<html><head><title>Weird California</title></head></html>";
    expect(parseLocationPage(html, 1)).toBeNull();
  });

  it("returns null when title is ' - Weird California'", () => {
    const html =
      "<html><head><title> - Weird California</title></head></html>";
    expect(parseLocationPage(html, 1)).toBeNull();
  });

  it("extracts address and zip", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.zip).toBe("95065");
  });

  it("extracts county from gallery image path", () => {
    const html = buildLocationHTML({
      galleryPath: "gallery/var/albums/Weird/California/Los-Angeles/",
    });
    const result = parseLocationPage(html, 1)!;
    expect(result.county).toBe("Los Angeles");
  });

  it("handles page with no images", () => {
    const html = buildLocationHTML({ images: false });
    const result = parseLocationPage(html, 1)!;
    expect(result.images).toEqual([]);
    expect(result.county).toBe("");
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
    expect(result.latitude).toBeNull();
    expect(result.longitude).toBeNull();
  });

  it("handles page with no dates", () => {
    const html = buildLocationHTML({ dates: false });
    const result = parseLocationPage(html, 1)!;
    expect(result.dateCreated).toBe("");
    expect(result.dateEdited).toBe("");
  });

  it("extracts images with full URLs", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.images).toHaveLength(2);
    expect(result.images[0]!.src).toContain("https://www.weirdca.com/");
    expect(result.images[0]!.alt).toBe("Photo 1");
  });

  it("stops description at 'Closest Weird'", () => {
    const html = buildLocationHTML({
      description:
        '<p>First paragraph.</p><p>Closest Weird locations nearby.</p><p>Should not appear.</p>',
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

  it("parses dates", () => {
    const html = buildLocationHTML({});
    const result = parseLocationPage(html, 1)!;
    expect(result.dateCreated).toBe("2005-03-12");
    expect(result.dateEdited).toBe("2023-08-01");
  });
});
