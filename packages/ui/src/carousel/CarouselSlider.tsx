import type { PropsWithChildren } from "react";
import type { Simplify } from "type-fest";
import type { BoxProps } from "../Box";
import { Box } from "../Box";
import styles from "./Carousel.module.css";
export type CarouselProps = Simplify<
  Omit<BoxProps, "children"> & PropsWithChildren<object>
>;

export const CarouselSlider = ({
  as,
  className,
  children,
  style,
  ...props
}: CarouselProps) => {
  return (
    <Box
      as={as ?? "div"}
      className={`${styles.slider} ${className ?? ""}`}
      style={style}
      {...props}
    >
      {children}
    </Box>
  );
};
