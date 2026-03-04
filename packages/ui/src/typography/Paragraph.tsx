import { Box } from "../Box";
import type { BoxProps } from "../Box";
import { DropCap } from "./DropCap";
import type { DropCapProps } from "./DropCap";
import { clsx } from "clsx/lite";
import styles from "./Typography.module.css";
import { extractStrings } from "#lib";

export type ParagraphProps = Omit<BoxProps<"p">, "as"> & {
  drop?: DropCapProps;
};

const ParagraphRoot = Box.boxWithDefaultAs("p");

export const Paragraph = ({
  className,
  children,
  drop,
  ...props
}: ParagraphProps) => {
  const strings = extractStrings(children);

  return (
    <>
      {drop && <DropCap {...drop}>{strings.shift()}</DropCap>}
      {strings.map((p: string, i: number) => (
        <ParagraphRoot
          key={i}
          className={clsx(styles.paragraph, className)}
          {...props}
        >
          {p}
        </ParagraphRoot>
      ))}
    </>
  );
};
