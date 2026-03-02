import { Box } from "../Box";
import styles from "./page.module.css";
import { PageHeader as Header } from "./PageHeader";
import { PageContent as Content } from "./PageContent";
import { TopNav } from "./TopNavigation";
import { SiteLogo as Logo } from "./Logo";

const PageLayoutRoot = Box.boxWithDefaultAs("div", {
  id: "root",
  className: styles.page_root,
});

export const PageLayout = Object.assign(PageLayoutRoot, {
  Header,
  Content,
  TopNav,
  Logo,
});
