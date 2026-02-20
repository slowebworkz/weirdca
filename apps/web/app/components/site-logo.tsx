import { Creepster } from "next/font/google";
import Link from "next/link";
import { useTranslations } from "next-intl";
import styles from "./siteLogo.module.css";

const Logos = ["sm", "md", "lg"] as const;

// Define the allowed size values
type Logo = Record<"size", (typeof Logos)[number]>;

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

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
        className={`${creepster.className} ${SIZES[size]} ${styles.siteLogo__span} tracking-wide text-red-700 group-hover:text-red-500 group-hover:drop-shadow-red-glow`}
        aria-hidden="true"
      >
        {t("name")}
      </span>
      <span className="sr-only">{`${t("name")} Home`}</span>
    </Link>
  );
}
