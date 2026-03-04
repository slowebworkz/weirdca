import { createElement } from "react";
import type { ElementType, ReactElement, ComponentPropsWithRef } from "react";
import clsx from "clsx";

// 1️⃣ Updated BoxProps: omit 'as' from ComponentPropsWithRef<T>
export type BoxProps<
  T extends ElementType = "div",
  P extends object = object,
> = { as?: T } & Omit<ComponentPropsWithRef<T>, "as"> & P;

export type PolymorphicComponent<TDefault extends ElementType = "div"> = {
  <T extends ElementType = TDefault>(props: BoxProps<T>): ReactElement;
  displayName?: string;
};

/** Base polymorphic element. Renders as `div` by default, or whatever `as` is set to. */
function BoxRoot<T extends ElementType = "div">({
  as,
  ...props
}: BoxProps<T>): ReactElement {
  return createElement(as ?? "div", props);
}

/**
 * Merges `defaultProps` (from `boxWithDefaultAs`) with runtime `props`,
 * omitting `as` from both so it never leaks into the rendered element's attributes.
 * `defaultProps` keys are set first; runtime `props` override them.
 */
function mergeProps<TDefault extends ElementType, T extends ElementType>(
  defaultProps?: Partial<ComponentPropsWithRef<TDefault>>,
  props?: BoxProps<T>,
): Omit<BoxProps<T>, "as"> {
  const result: Record<string, unknown> = {};

  for (const source of [defaultProps, props]) {
    if (!source) continue;

    for (const [key, value] of Object.entries(source)) {
      if (key === "as") continue;

      if (
        key === "className" &&
        typeof value === "string" &&
        typeof result.className === "string"
      ) {
        result.className = clsx(result.className, value);
        continue;
      }

      result[key] = value;
    }
  }

  return result as Omit<BoxProps<T>, "as">;
}

/** Returns a React DevTools display name, e.g. `Box(header)` for string elements. */
function getDisplayName(defaultAs: ElementType) {
  return typeof defaultAs === "string" ? `Box(${defaultAs})` : "Box";
}

const boxCache = new Map<ElementType, PolymorphicComponent<ElementType>>();

/**
 * Creates a pre-configured polymorphic `Box` with a fixed default element and default props.
 * Consumers can still override `as` and any prop at the call site.
 *
 * @param defaultAs - The element type to render when no `as` prop is provided.
 * @param defaultProps - Props applied as a baseline, overridable by the consumer.
 */
function boxWithDefaultAs<TDefault extends ElementType = "div">(
  defaultAs: TDefault,
  defaultProps?: Partial<ComponentPropsWithRef<TDefault>>,
): PolymorphicComponent<TDefault> {
  if (!defaultProps && boxCache.has(defaultAs)) {
    return boxCache.get(defaultAs) as PolymorphicComponent<TDefault>;
  }

  const Component = <T extends ElementType = TDefault>({
    as,
    ...props
  }: BoxProps<T>): ReactElement => {
    const Element = (as ?? defaultAs) as ElementType;

    return createElement(Element, mergeProps(defaultProps, props));
  };

  Component.displayName = getDisplayName(defaultAs);

  if (!defaultProps) {
    boxCache.set(defaultAs, Component);
  }

  return Component;
}

// 4️⃣ Export Box with a non-generic call signature so that child components using
// Box internally don't need to cast `as` when the parent is itself generic.
// BoxRoot remains generic; only the exported type is widened to ElementType so
// TypeScript doesn't try to infer T from a `T | "default"` union at call sites.
export const Box: {
  (props: BoxProps<ElementType>): ReactElement;
  boxWithDefaultAs: typeof boxWithDefaultAs;
} = Object.assign(BoxRoot, { boxWithDefaultAs });
