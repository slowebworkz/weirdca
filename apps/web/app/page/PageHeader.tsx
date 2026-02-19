import Link from "next/link";
import { Box, boxWithDefaultAs } from "@repo/ui/Box";
import type { BoxProps } from "@repo/ui/Box";
import navEntries from "../nav.json" with { type: "json" };
import styles from "../layout.module.css";

export type PageHeaderProps = BoxProps<"header"> & {
  topNavigationLabel?: string;
};

const TopNavLink = boxWithDefaultAs(Link, {
  className: "transition-colors hover:text-red-400",
});

const TopNav = boxWithDefaultAs("nav", {
  className: `${styles.nav} max-w-content px-6 py-4`,
});

export const PageHeader = ({
  as = "header",
  children,
  topNavigationLabel,
}: PageHeaderProps) => {
  return (
    <Box as={as ?? "header"} className={styles.header} role="banner">
      <TopNav aria-label={topNavigationLabel}>
        {children}

        <ul className="flex gap-6 text-sm text-gray-300">
          {navEntries.map(({ label, href }) => (
            <li key={href}>
              <TopNavLink href={href}>{label}</TopNavLink>
            </li>
          ))}
        </ul>
      </TopNav>
    </Box>
  );
};
