import { creepster } from "../fonts/creepster";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./SiteLogo.module.css";

type Logo = { size: "sm" | "md" | "lg" };

type LogoTextProps = { name: string; size: Logo["size"] };

type LogoSRLabelProps = Omit<LogoTextProps, "size">;

const SIZES: Record<Logo["size"], string> = {
  sm: "text-2xl",
  md: "text-4xl",
  lg: "text-6xl sm:text-7xl",
} as const;

function LogoText({ name, size }: LogoTextProps) {
  return (
    <span
      className={`${styles.siteLogo__span} ${creepster.className} ${SIZES[size]} tracking-wide text-red-700 group-hover:text-red-500 group-hover:drop-shadow-red-glow`}
    >
      {name}
    </span>
  );
}

function LogoSRLabel({ name }: LogoSRLabelProps) {
  return <span className="sr-only">{`${name} Home`}</span>;
}

export function SiteLogo({ size = "md" }: Logo) {
  const t = useTranslations("site");

  return (
    <Link href="/" className={`${styles.siteLogo} group`}>
      <LogoText name={t("name")} size={size} />
      <LogoSRLabel name={t("name")} />
    </Link>
  );
}
