import { playfairDisplay } from "@/fonts";
import { Paragraph } from "@repo/ui/typography";
import type { ParagraphProps } from "@repo/ui/typography";
import clsx from "clsx";
import styles from "./home.module.css";

export type IntroParagraphProps = Omit<ParagraphProps, "as"> & {
  text?: string;
};

export function IntroParagraph({ text, ...props }: IntroParagraphProps) {
  const drop = {
    lines: "2",
    capFont: playfairDisplay.variable,
  };

  return (
    <section className={clsx(styles.intro, "mt-12 max-w-2xl")}>
      {text && (
        <Paragraph drop={drop} {...props}>
          {text}
        </Paragraph>
      )}
    </section>
  );
}
