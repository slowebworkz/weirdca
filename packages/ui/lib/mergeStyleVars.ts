import type { CSSProperties } from "react";

type StyleValue = string | number;
type StyleVars = Record<`--${string}`, StyleValue | undefined>;

function hasKeys(obj: object): boolean {
  for (const _ in obj) return true;
  return false;
}

function applyVars(target: CSSProperties, vars: StyleVars): void {
  const style = target as Record<string, string>;

  for (const [key, value] of Object.entries(vars)) {
    if (value !== undefined) {
      style[key] = String(value);
    }
  }
}

export function mergeStyleVars(
  base?: CSSProperties,
  vars?: StyleVars,
): CSSProperties | undefined {
  if (!base && !vars) return undefined;

  const merged: CSSProperties = { ...base };

  if (vars) applyVars(merged, vars);

  return hasKeys(merged) ? merged : undefined;
}
