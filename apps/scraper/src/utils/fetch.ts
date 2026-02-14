import { mkdir, writeFile } from "node:fs/promises";
import { DATA_DIR } from "./constants";

export async function fetchPage(url: string): Promise<string> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} for ${url}`);
  }
  return response.text();
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function writeJSON(
  filename: string,
  data: unknown,
): Promise<string> {
  await mkdir(DATA_DIR, { recursive: true });
  const outputPath = `${DATA_DIR}/${filename}`;
  await writeFile(outputPath, JSON.stringify(data, null, 2));
  return outputPath;
}
