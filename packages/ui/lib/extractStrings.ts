import type { ReactNode } from "react";
import { Children } from "react";

export function extractStrings(children: ReactNode): string[] {
  const strings = Children.toArray(children)
    .filter(
      (child): child is string | number =>
        typeof child === "string" || typeof child === "number",
    )
    .map(String);

  return strings.reduce<string[]>((acc, str) => {
    const parts = str
      .split(/\n\n+/)
      .map((s) => s.trim())
      .filter(Boolean);
    acc.push(...parts);
    return acc;
  }, []);
}
