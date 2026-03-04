import { playfairDisplay } from "@/fonts";
import { Paragraph } from "@repo/ui/typography";
import clsx from "clsx";
import styles from "./home.module.css";

export function IntroParagraph({ text }: { text?: string }) {
  const drop = {
    lines: "2",
    capFont: playfairDisplay.variable,
  };

  return (
    <section className={clsx(styles.intro, "mt-12 max-w-2xl")}>
      {text && <Paragraph drop={drop}>{text}</Paragraph>}
    </section>
  );
}
