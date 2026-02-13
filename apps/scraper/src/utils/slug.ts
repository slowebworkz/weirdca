import slugify from "slugify";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const _slugify = slugify as any as (str: string, opts?: object) => string;

export function makeSlug(input: string, city?: string): string {
  const raw = city ? `${input} ${city}` : input;
  return _slugify(raw, { lower: true, strict: true });
}
