import { clsx } from "clsx/lite";
import type { BoxProps } from "../Box";
import { Box } from "../Box";
import styles from "./hero.module.css";

export type HeroProps = Omit<BoxProps<"section">, "as">;

const HeroRoot = Box.boxWithDefaultAs("section", {
  className: clsx(styles.hero, "px-6 py-16"),
});

export const Hero = ({ children, ...props }: HeroProps) => {
  return <HeroRoot {...props}>{children}</HeroRoot>;
};
