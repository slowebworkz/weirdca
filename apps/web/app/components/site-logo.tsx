import { creepster } from "@/fonts";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./SiteLogo.module.css";

type Logo = { size: "sm" | "md" | "lg" };

const SIZES: Record<Logo["size"], string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl sm:text-7xl",
} as const;

export function SiteLogo({ size = "md" }: Logo) {
  const t = useTranslations("site");

  return (
    <Link href="/" className={`${styles.siteLogo} group`}>
      <span
        className={`${styles.siteLogo__span} ${creepster.className} ${SIZES[size]} tracking-wide text-red-700 group-hover:text-red-500 group-hover:drop-shadow-red-glow`}
      >
        {t("name")}
      </span>
      <span className="sr-only">{`${t("name")} Home`}</span>
    </Link>
  );
}
