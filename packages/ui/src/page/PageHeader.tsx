import type { BoxProps } from "@repo/ui/Box";
import { Box, boxWithDefaultAs } from "@repo/ui/Box";
import type { ReactNode, PropsWithChildren } from "react";
import styles from "./page.module.css";

export type PageHeaderProps = Omit<BoxProps<"header">, "children"> &
  PropsWithChildren<{
    "nav-label"?: string;
    logo?: ReactNode;
  }>;

const TopNav = boxWithDefaultAs("nav", {
  className: `${styles.nav} max-w-content px-6 py-4`,
});

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

        <ul className="flex gap-6 text-sm text-gray-300">{children}</ul>
      </TopNav>
    </Box>
  );
};
