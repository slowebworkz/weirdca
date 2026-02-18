import { createElement } from "react";
import type { JSX, PropsWithChildren } from "react";
import type { Simplify } from "type-fest";

export type BoxProps<T extends keyof JSX.IntrinsicElements> = Simplify<
  JSX.IntrinsicElements[T] & PropsWithChildren<{ as: T }>
>;

export function Box<T extends keyof JSX.IntrinsicElements>({
  as,
  ...props
}: BoxProps<T>): JSX.Element {
  return createElement(as, props);
}
