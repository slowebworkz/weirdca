import { NavigationMenu } from "@base-ui/react/navigation-menu";
import type { ElementType } from "react";
import type { Simplify } from "type-fest";
import styles from "./page.module.css";
import { clsx } from "clsx/lite";

export type TopNavProps = Simplify<
  Omit<NavigationMenu.Root.Props, "linkAs"> & {
    linkAs?: ElementType;
    links?: Record<"label" | "href", string>[];
    currentHref?: string;
  }
>;

export type TopNavLinksProps = Simplify<
  Omit<NavigationMenu.Link.Props, "linkAs"> &
    Pick<TopNavProps, "links" | "linkAs" | "currentHref">
>;

const TopNavLinks = ({
  links,
  linkAs: Link,
  currentHref,
  ...props
}: TopNavLinksProps) => {
  if (!(links && links.length > 0)) {
    return;
  }

  return (
    <>
      {links.map(({ label, href }, index) => (
        <NavigationMenu.Item key={`${href}${index}`}>
          <NavigationMenu.Link
            href={href}
            aria-current={currentHref === href ? "page" : undefined}
            {...props}
            {...(Link && { render: <Link href={href} /> })}
          >
            {label}
          </NavigationMenu.Link>
        </NavigationMenu.Item>
      ))}
    </>
  );
};

export const TopNav = ({
  className,
  children,
  linkAs,
  links,
  currentHref,
  ...props
}: TopNavProps) => {
  return (
    <NavigationMenu.Root className={clsx(styles.nav, className)} {...props}>
      <NavigationMenu.List className={styles.nav_right}>
        <TopNavLinks linkAs={linkAs} links={links} currentHref={currentHref} />
      </NavigationMenu.List>

      {children}
    </NavigationMenu.Root>
  );
};
