import type { Comment } from "@repo/types";
import { parseComment } from "@scraper/parsers/comment";
import { textTrim } from "@scraper/utils";
import type { $ } from "@scraper/utils";

export function parseComments($: $): Comment[] {
  const comments: Comment[] = [];
  const header = $("b:contains('Comments:')");
  if (header.length > 0) {
    header
      .closest("p")
      .next("ul")
      .find("li")
      .each((_, el) => {
        const parsed = parseComment(textTrim($(el)));
        if (parsed) comments.push(parsed);
      });
  }
  return comments;
}
