import { Box } from "../Box";
import { SiteLogo as Logo } from "./Logo";
import styles from "./page.module.css";
import { PageContent as Content } from "./PageContent";
import { PageHeader as Header } from "./PageHeader";
import { TopNav } from "./TopNavigation";
import { clsx } from "clsx/lite";

const PageLayoutRoot = Box.boxWithDefaultAs("div", {
  className: clsx(styles.page_root, "flex"),
});

export const PageLayout = Object.assign(PageLayoutRoot, {
  Header,
  Content,
  TopNav,
  Logo,
});
