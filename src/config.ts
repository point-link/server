import { base64, load } from "./deps.ts";

// 加载 .env 文件中的配置到环境变量
await load({ export: true });

// DB_URI
const _DB_URI = Deno.env.get("DB_URI");
if (!_DB_URI) {
  throw new Error("缺少环境变量: DB_URI");
}
export const DB_URI = _DB_URI;

// JWT_PRIVATE_KEY
const _JWT_PRIVATE_KEY = Deno.env.get("JWT_PRIVATE_KEY");
if (!_JWT_PRIVATE_KEY) {
  throw new Error("缺少环境变量: JWT_PRIVATE_KEY");
}
export const JWT_PRIVATE_KEY = await crypto.subtle.importKey(
  "pkcs8",
  base64.decode(_JWT_PRIVATE_KEY),
  { name: "ECDSA", namedCurve: "P-256" },
  false,
  ["sign"],
);

// JWT_PUBLIC_KEY
const _JWT_PUBLIC_KEY = Deno.env.get("JWT_PUBLIC_KEY");
if (!_JWT_PUBLIC_KEY) {
  throw new Error("缺少环境变量: JWT_PUBLIC_KEY");
}
export const JWT_PUBLIC_KEY = await crypto.subtle.importKey(
  "spki",
  base64.decode(_JWT_PUBLIC_KEY),
  { name: "ECDSA", namedCurve: "P-256" },
  false,
  ["verify"],
);
