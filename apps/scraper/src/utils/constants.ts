import { resolve } from "node:path";

export const BASE_URL = "https://www.weirdca.com";
export const DATA_DIR = resolve(import.meta.dirname, "../../data");
export const DELAY_MS = 500; // Be polite to the server
export const CONCURRENCY = 5; // Max parallel requests
