import type { Comment } from "@repo/types";

export function parseComment(liText: string): Comment | null {
  // Pattern: "Name of City, State on YYYY-MM-DD said: comment text"
  const withCity = liText.match(
    /^(.+?)\s+of\s+(.+?),\s*(\S+)\s+on\s+(\d{4}-\d{2}-\d{2})\s+said:\s*([\s\S]+)$/
  );
  if (withCity) {
    return {
      name: withCity[1]!.trim(),
      city: withCity[2]!.trim(),
      state: withCity[3]!.trim(),
      text: withCity[5]!.trim(),
      date: withCity[4]!,
    };
  }
  // Pattern: "Anonymous on YYYY-MM-DD said: comment text"
  const noCity = liText.match(
    /^(.+?)\s+on\s+(\d{4}-\d{2}-\d{2})\s+said:\s*([\s\S]+)$/
  );
  if (noCity) {
    return {
      name: noCity[1]!.trim(),
      city: null,
      state: null,
      text: noCity[3]!.trim(),
      date: noCity[2]!,
    };
  }
  return null;
}
