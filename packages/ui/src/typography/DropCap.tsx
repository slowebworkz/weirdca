import type { ElementType } from "react";
import type { Simplify } from "type-fest";
import type { BoxProps } from "../Box";
import { Paragraph } from "./Paragraph";
import styles from "./Typography.module.css";
import { mergeStyleVars } from "#lib";

export type DropCapProps<T extends ElementType = "p"> = Simplify<
  Omit<BoxProps<T>, "as"> & {
    lines?: string | number;
    textFont?: string;
    capFont?: string;
  }
>;

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
      style={mergeStyleVars(style, {
        "--drop-cap-lines": Number(lines) > 0 ? String(lines) : undefined,
        "--drop-cap-text-font-family": textFont,
        "--drop-cap-font-family": capFont,
      })}
      {...props}
    >
      {children}
    </Paragraph>
  );
}
