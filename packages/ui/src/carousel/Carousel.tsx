import type { ElementType, PropsWithChildren } from "react";
import { Prev, Next } from "./CarouselControls";
import styles from "./Carousel.module.css";
import { Box } from "../Box";
import type { BoxProps } from "../Box";
import type { Simplify } from "type-fest";
import { CarouselSlider } from "./CarouselSlider";

export type CarouselProps<T extends ElementType> = Simplify<
  Omit<BoxProps<T>, "children"> &
    PropsWithChildren<{ autoPlay?: number; loop?: boolean }>
>;

export const Carousel = <T extends ElementType = "article">({
  as,
  className,
  ...props
}: CarouselProps<T>) => {
  return (
    <Box
      as={as ?? "article"}
      className={`${styles.carousel} ${className ?? ""}`}
      {...props}
    >
      <Box className={styles.body}>
        <Prev />
        <Next />

        <CarouselSlider></CarouselSlider>
      </Box>
    </Box>
  );

  // return (
  //   <article >
  //     <div className={styles.body}>
  //       <Prev />
  //       <Next />

  //       <div className={styles.slider}>{children}</div>
  //     </div>
  //   </article>
  // );
};
