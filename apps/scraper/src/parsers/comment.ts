import type { Comment } from "@repo/types";

interface CommentGroups {
  name: string;
  city: string;
  state: string;
  date: string;
  text: string;
}

type AnonymousGroups = Omit<CommentGroups, "city" | "state">;

const WITH_CITY =
  /^(?<name>.+?)\s+of\s+(?<city>.+?),\s*(?<state>\S+)\s+on\s+(?<date>\d{4}-\d{2}-\d{2})\s+said:\s*(?<text>[\s\S]+)$/;

const NO_CITY =
  /^(?<name>.+?)\s+on\s+(?<date>\d{4}-\d{2}-\d{2})\s+said:\s*(?<text>[\s\S]+)$/;

export function parseComment(liText: string): Comment | null {
  const withCity = liText.match(WITH_CITY)?.groups as CommentGroups | undefined;
  if (withCity) {
    return {
      name: withCity.name.trim(),
      city: withCity.city.trim(),
      state: withCity.state.trim(),
      text: withCity.text.trim(),
      date: withCity.date,
    };
  }

  const noCity = liText.match(NO_CITY)?.groups as AnonymousGroups | undefined;
  if (noCity) {
    return {
      name: noCity.name.trim(),
      city: null,
      state: null,
      text: noCity.text.trim(),
      date: noCity.date,
    };
  }

  return null;
}
