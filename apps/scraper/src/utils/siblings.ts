import type { Cheerio } from "cheerio";
import type { AnyNode } from "domhandler";

export function* siblings<T extends AnyNode>(
  start: Cheerio<T>,
): Generator<Cheerio<T>> {
  let current = start.next();
  while (current.length) {
    yield current as Cheerio<T>;
    current = current.next();
  }
}
