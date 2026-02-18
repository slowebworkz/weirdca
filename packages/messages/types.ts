import type { Paths } from "type-fest";

type Primitive = string | number | boolean | null | undefined;

type LeafPaths<T> = {
  [K in keyof T & string]: T[K] extends Primitive
    ? K
    : T[K] extends Record<string, unknown>
      ? `${K}.${LeafPaths<T[K]>}`
      : never;
}[keyof T & string];

// type LeafPaths<T> = Paths<T> extends infer P
//   ? P extends string
//     ? P extends `${string}.${string}`
//       ? P
//       : never
//     : never
//   : never;

export type { LeafPaths };
