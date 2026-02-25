import type { BoxProps } from "@repo/ui/Box";
import { Box, boxWithDefaultAs } from "@repo/ui/Box";
import clsx from "clsx";
import type { ReactNode, PropsWithChildren } from "react";
import styles from "./page.module.css";

export type PageHeaderProps = Omit<BoxProps<"header">, "children"> &
  PropsWithChildren<{
    "nav-label"?: string;
    logo?: ReactNode;
  }>;

const TopNav = boxWithDefaultAs("nav", {
  className: clsx(styles.nav, "max-w-content px-6 py-4"),
});

const RightNav = boxWithDefaultAs("ul", {
  className: clsx(styles.nav_right, "text-sm text-gray-300"),
});
//flex gap-6 text-sm text-gray-300

export const PageHeader = ({
  as = "header",
  className,
  children,
  "nav-label": navLabel,
  logo,
  ...props
}: PageHeaderProps) => {
  return (
    <Box as={as} className={className} {...props}>
      <TopNav aria-label={navLabel ?? undefined}>
        {logo}

        <RightNav>{children}</RightNav>
      </TopNav>
    </Box>
  );
};
