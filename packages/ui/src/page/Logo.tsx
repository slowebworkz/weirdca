import type { ElementType } from "react";
import type { Simplify } from "type-fest";
import type { BoxProps } from "../Box";
import { Box } from "../Box";
import styles from "./page.module.css";

export type SiteLogoProps = Simplify<
  Omit<BoxProps<"img">, "linkAs" | "link"> & {
    linkAs?: ElementType;
    link?: string;
    caption?: string;
  }
>;

const Logo = Box.boxWithDefaultAs("img", {
  className: styles.site_logo,
});

const LogoSpan = Box.boxWithDefaultAs("span", {
  className: "sr-only",
});

export const SiteLogo = ({
  linkAs: Link,
  link: href,
  caption,
  ...props
}: SiteLogoProps) => {
  if (Link && href) {
    return (
      <Link href={href}>
        <Logo {...props} />
        {caption && <LogoSpan>{caption}</LogoSpan>}
      </Link>
    );
  }

  return <Logo {...props} />;
};
