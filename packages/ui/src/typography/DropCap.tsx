import type { CSSProperties, ElementType, PropsWithChildren } from "react";
import type { Simplify } from "type-fest";

import type { BoxProps } from "../Box";
import { Box } from "../Box";

import styles from "./DropCap.module.css";

export type DropCapProps<T extends ElementType = "p"> = Simplify<
  Omit<BoxProps<T>, "children"> &
    PropsWithChildren<{
      lines?: string | number;
      textFont?: string;
      capFont?: string;
    }>
>;

function resolveStyle(
  lines: DropCapProps["lines"],
  textFont: string | undefined,
  capFont: string | undefined,
  style: CSSProperties | undefined,
): CSSProperties | null {
  const merged = { ...style } as CSSProperties;
  if (Number(lines) > 0)
    Object.assign(merged, { "--drop-cap-lines": String(lines) });
  if (textFont)
    Object.assign(merged, { "--drop-cap-text-font-family": textFont });
  if (capFont) Object.assign(merged, { "--drop-cap-font-family": capFont });
  return Object.keys(merged).length > 0 ? merged : null;
}

export function DropCap<T extends ElementType = "p">({
  as,
  lines,
  textFont,
  capFont,
  className,
  children,
  style,
  ...props
}: DropCapProps<T>) {
  const classes = [styles.dropcap ?? "", className].filter(Boolean).join(" ");

  return (
    <Box
      as={as ?? "p"}
      className={classes}
      style={resolveStyle(lines, textFont, capFont, style)}
      {...props}
    >
      {children}
    </Box>
  );
}
