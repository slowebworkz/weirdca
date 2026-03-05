import type { ElementType, ReactNode } from "react";
import type { BoxProps } from "../Box";
import { Box } from "../Box";
import { LayoutContainer } from "./LayoutContainer";
import styles from "./page.module.css";

export type PageHeaderProps<T extends ElementType = "header"> = Omit<
  BoxProps<T>,
  "logo"
> & {
  logo?: ReactNode;
};

const Header = Box.boxWithDefaultAs("header", {
  role: "banner",
  className: styles.page_header,
});

export const PageHeader = ({ children, ...props }: PageHeaderProps) => {
  return (
    <Header {...props}>
      <LayoutContainer className="flex">{children}</LayoutContainer>
    </Header>
  );
};
