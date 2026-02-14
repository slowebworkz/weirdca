export function log(message: string): void {
  console.log(message);
}

export function warn(message: string): void {
  console.warn(message);
}

export function error(message: string, err?: unknown): void {
  console.error(message, err ?? "");
}

export function blank(): void {
  console.log("");
}

export function header(title: string): void {
  console.log(`\n=== ${title} ===\n`);
}
