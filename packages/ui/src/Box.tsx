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

  for (const _props of [defaultProps, props]) {
    if (_props && Object.keys(_props).length > 0) {
      for (const key of Object.keys(_props)) {
        if (key === "as") continue;

        if (
          key === "className" &&
          typeof _props[key] === "string" &&
          typeof result["className"] === "string"
        ) {
          result["className"] = clsx(result["className"], _props["className"]);
          continue;
        }

        result[key] = _props[key as keyof typeof _props];
      }
    }
  }

  return result as Omit<BoxProps<T>, "as">;
}

/** Returns a React DevTools display name, e.g. `Box(header)` for string elements. */
function getDisplayName(defaultAs: ElementType) {
  return typeof defaultAs === "string" ? `Box(${defaultAs})` : "Box";
}

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
  const Component = <T extends ElementType = TDefault>({
    as,
    ...props
  }: BoxProps<T>): ReactElement => {
    return createElement(
      (as ?? defaultAs) as ElementType,
      mergeProps(defaultProps, props),
    );
  };

  return Object.assign(Component, {
    displayName: getDisplayName(defaultAs),
  });
}

// 4️⃣ Export Box with a non-generic call signature so that child components using
// Box internally don't need to cast `as` when the parent is itself generic.
// BoxRoot remains generic; only the exported type is widened to ElementType so
// TypeScript doesn't try to infer T from a `T | "default"` union at call sites.
export const Box: {
  (props: BoxProps<ElementType>): ReactElement;
  boxWithDefaultAs: typeof boxWithDefaultAs;
} = Object.assign(BoxRoot, { boxWithDefaultAs });
