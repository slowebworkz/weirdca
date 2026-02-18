import nav from "./src/nav.json" with { type: "json" };
import site from "./src/site.json" with { type: "json" };
import home from "./src/home.json" with { type: "json" };
import location from "./src/location.json" with { type: "json" };
import category from "./src/category.json" with { type: "json" };
import county from "./src/county.json" with { type: "json" };
import city from "./src/city.json" with { type: "json" };
import search from "./src/search.json" with { type: "json" };
import map from "./src/map.json" with { type: "json" };
import common from "./src/common.json" with { type: "json" };
import type { LeafPaths } from "./types.ts";

const messages = {
  nav,
  site,
  home,
  location,
  category,
  county,
  city,
  search,
  map,
  common,
} as const;

export default messages;
export type Messages = typeof messages;
export type MessageKeys = LeafPaths<Messages>;
