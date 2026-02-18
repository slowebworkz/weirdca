import { getRequestConfig } from "next-intl/server";
import messages from "@repo/messages";

export default getRequestConfig(async () => ({
  locale: "en",
  messages,
}));
