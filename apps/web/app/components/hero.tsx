import type { JSX } from "react";
import { Box } from "@repo/ui/Box";
import type { BoxProps } from "@repo/ui/Box";
import { Carousel } from "@repo/ui/carousel";
import styles from "./hero.module.css";

export async function Hero({
  as = "section",
  className,
  ...props
}: Partial<BoxProps<"section">>): Promise<JSX.Element> {
  return (
    <Box
      as={as}
      className={`${className} ${styles.pageHero} rounded-xl bg-gray-950 px-6 py-16 ring-1 ring-gray-800 text-center text-white`}
      {...props}
    >
      <Carousel />
    </Box>
  );
}
