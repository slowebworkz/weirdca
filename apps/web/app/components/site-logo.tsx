import { Creepster } from "next/font/google";
import Link from "next/link";

const creepster = Creepster({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
});

export function SiteLogo({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const sizeClasses = {
    sm: "text-2xl",
    md: "text-4xl",
    lg: "text-6xl sm:text-7xl",
  };

  return (
    <Link href="/" className="group inline-block">
      <span
        className={`${creepster.className} ${sizeClasses[size]} select-none tracking-wide text-red-700 transition-all duration-300 group-hover:text-red-500 group-hover:drop-shadow-[0_0_12px_rgba(220,38,38,0.5)]`}
      >
        Weird California
      </span>
    </Link>
  );
}
