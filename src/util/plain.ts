import { concat, crypto } from "../deps.ts";

const encoder = new TextEncoder();
export async function blake3(...data: (string | Uint8Array)[]) {
  const buffers = data.map((d) =>
    typeof d === "string" ? encoder.encode(d) : d
  );
  const digest = await crypto.subtle.digest(
    "BLAKE3",
    concat(...buffers),
  );
  return new Uint8Array(digest);
}

export async function asyncIgnoreError<T>(func: () => Promise<T>) {
  try {
    return await func();
  } catch (_err) {
    return undefined;
  }
}

export function syncIgnoreError<T>(func: () => T) {
  try {
    return func();
  } catch (_err) {
    return undefined;
  }
}
