import type { ElementType, PropsWithChildren, ReactNode } from "react";
import type { Simplify } from "type-fest";
import type { BoxProps } from "../Box";
import { Box } from "../Box";
import styles from "./page.module.css";

export type PageHeaderProps<T extends ElementType = "header"> = Simplify<
  Omit<BoxProps<T>, "children" | "logo"> &
    PropsWithChildren<{
      logo?: ReactNode;
    }>
>;

const Header = Box.boxWithDefaultAs("header", {
  role: "banner",
  className: styles.page_header,
});

export const PageHeader = ({ children, ...props }: PageHeaderProps) => {
  return <Header {...props}>{children}</Header>;
};
