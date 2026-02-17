import { siblings, textTrim } from "@scraper/utils";
import type { parseAddress } from "./parse-address";

export function parseDescription(
  addressDiv: ReturnType<typeof parseAddress>["addressDiv"],
): string {
  const parts: string[] = [];

  for (const current of siblings(addressDiv)) {
    const text = textTrim(current);

    if (
      text.includes("Closest Weird") ||
      ["follow", "buttons"].some((cls) => current.hasClass(cls))
    ) {
      break;
    }

    if (!current.is("p") || text.length === 0) continue;
    if (current.find("b:contains('Comments')").length > 0) continue;

    const paraText = text.replaceAll(/\s+/g, " ");
    if (paraText) parts.push(paraText);
  }

  return parts.join("\n\n");
}
