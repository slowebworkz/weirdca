import { extractStrings } from "#lib";
import { clsx } from "clsx/lite";
import type { BoxProps } from "../Box";
import { Box } from "../Box";
import type { DropCapProps } from "./DropCap";
import { DropCap } from "./DropCap";
import styles from "./Typography.module.css";

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
