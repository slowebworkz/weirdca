import { playfairDisplay } from "@/fonts";
import { useTranslations } from "next-intl";
import { DropCap } from "@repo/ui/typography";
import styles from "./home.module.css";

export function IntroParagraph() {
  const t = useTranslations("site");

  return (
    <section className={`${styles.intro} mt-12 max-w-2xl`}>
      <DropCap lines="2" capFont={playfairDisplay.variable}>
        {t("intro_paragraph")}
      </DropCap>
    </section>
  );
}
