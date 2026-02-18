import type { Messages } from "@repo/messages";

declare module "next-intl" {
  interface AppConfig {
    Messages: Messages;
  }
}
