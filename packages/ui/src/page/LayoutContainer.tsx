import { clsx } from "clsx/lite";
import { Box } from "../Box";
import styles from "./page.module.css";

export const LayoutContainer = Box.boxWithDefaultAs("div", {
  className: clsx(styles.layout, "container"),
});
