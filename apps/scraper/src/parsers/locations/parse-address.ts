import type { $ as CheerioAPI } from "@scraper/utils";
import { captureGroup, textTrim } from "@scraper/utils";

export function parseAddress($: CheerioAPI): {
  addressDiv: ReturnType<CheerioAPI>;
  address: string;
  city: string;
  zip: string;
} {
  const addressDiv = $("#address");
  const result = { addressDiv, address: "", city: "", zip: "" };

  if (addressDiv.length) {
    const addressText = textTrim(addressDiv);
    if (addressText.length) {
      result.city =
        textTrim(addressDiv.find('a[href^="search2.php?city="]').first()) || "";

      const match = addressText.match(
        /^(.+?),\s*[^,]+,\s*California\s*(\d{5})?/,
      );
      if (match) {
        result.address = captureGroup(match, 1);
        result.zip = captureGroup(match, 2);
      }
    }
  }

  return result;
}
