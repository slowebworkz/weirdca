import type { CSSProperties, ElementType } from "react";
import type { Simplify } from "type-fest";
import type { BoxProps } from "../Box";
import { Paragraph } from "./Paragraph";
import styles from "./Typography.module.css";

export type DropCapProps<T extends ElementType = "p"> = Simplify<
  Omit<BoxProps<T>, "as"> & {
    lines?: string | number;
    textFont?: string;
    capFont?: string;
  }
>;

function resolveStyle(
  lines: DropCapProps["lines"],
  textFont: string | undefined,
  capFont: string | undefined,
  style: CSSProperties | undefined,
): CSSProperties | undefined {
  const merged = { ...style } as CSSProperties;
  if (Number(lines) > 0)
    Object.assign(merged, { "--drop-cap-lines": String(lines) });
  if (textFont)
    Object.assign(merged, { "--drop-cap-text-font-family": textFont });
  if (capFont) Object.assign(merged, { "--drop-cap-font-family": capFont });
  return Object.keys(merged).length > 0 ? merged : undefined;
}

export function DropCap<T extends ElementType = "p">({
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
    <Paragraph
      className={classes}
      style={resolveStyle(lines, textFont, capFont, style)}
      {...props}
    >
      {children}
    </Paragraph>
  );
}
