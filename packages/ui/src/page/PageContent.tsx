import type { Simplify } from "type-fest";
import type { BoxProps } from "../Box";
import { Box } from "../Box";
import { LayoutContainer } from "./LayoutContainer";
import styles from "./page.module.css";

export type PageContentProps = Simplify<BoxProps<"main">>;

const Main = Box.boxWithDefaultAs("main", {
  className: styles.main,
});

export const PageContent = ({ children, ...props }: PageContentProps) => {
  return (
    <Main {...props}>
      <LayoutContainer>{children}</LayoutContainer>
    </Main>
  );
};
