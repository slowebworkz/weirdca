import type { $ } from "@scraper/utils";
import { captureGroup, textTrim } from "@scraper/utils";

export function parseDates($: $) {
  const result = { dateCreated: "", dateEdited: "" };

  const dateBlock = textTrim($("i:contains('First Created:')"));
  if (dateBlock.length > 0) {
    const dateCreated = captureGroup(
      dateBlock.match(/First Created:\s*(\d{4}-\d{2}-\d{2})/),
      1,
    );
    if (dateCreated.length > 0) result.dateCreated = dateCreated;
    const dateEdited = captureGroup(
      dateBlock.match(/Last Edited:\s*(\d{4}-\d{2}-\d{2})/),
      1,
    );
    if (dateEdited.length > 0) result.dateEdited = dateEdited;
  }

  return result;
}
