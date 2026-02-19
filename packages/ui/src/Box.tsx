import { createElement } from "react";
import type { ElementType, ReactElement, ComponentPropsWithRef } from "react";

export type BoxProps<T extends ElementType = "div"> = {
  as?: T;
} & ComponentPropsWithRef<T>;

export type PolymorphicComponent<TDefault extends ElementType = "div"> = {
  <T extends ElementType = TDefault>(props: BoxProps<T>): ReactElement;
  displayName?: string;
};

export function Box<T extends ElementType = "div">({
  as,
  ...props
}: BoxProps<T>): ReactElement {
  return createElement(as ?? "div", props);
}

export function boxWithDefaultAs<TDefault extends ElementType = "div">(
  defaultAs: TDefault,
  defaultProps?: Partial<ComponentPropsWithRef<TDefault>>,
): PolymorphicComponent<TDefault> {
  const Component = <T extends ElementType = TDefault>({
    as,
    ...props
  }: BoxProps<T>): ReactElement => {
    const Element: ElementType = as ?? defaultAs;

    // Merge defaultProps blindly, since T may differ from TDefault
    const mergedProps = { ...defaultProps, ...props };

    return <Box as={Element} {...mergedProps} />;
  };

  Component.displayName =
    typeof defaultAs === "string" ? `Box(${defaultAs})` : "Box";

  return Component;
}
