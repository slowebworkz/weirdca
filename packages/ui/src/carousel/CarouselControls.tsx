import { Box } from "../Box";
import type { BoxProps } from "../Box";
import { ChevronLeft, ChevronRight } from "lucide-react";

type ControlProps = Omit<BoxProps, "children">;

export const Prev = ({ as, ...props }: ControlProps) => {
  return (
    <Box as={as ?? "div"} className="carousel__prev hidden" {...props}>
      <ChevronLeft />
    </Box>
  );
};

export const Next = ({ as, ...props }: ControlProps) => {
  return (
    <Box as={as ?? "div"} className="carousel__next hidden" {...props}>
      <ChevronRight />
    </Box>
  );
};
