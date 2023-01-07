import { base64, load } from "./deps.ts";

// 加载 .env 文件中的配置到环境变量
await load({ export: true });

// DB_URI
const _DB_URI = Deno.env.get("DB_URI");
if (!_DB_URI) {
  throw new Error("缺少环境变量: DB_URI");
}
export const DB_URI = _DB_URI;

// JWT_KEY
const _JWT_KEY = Deno.env.get("JWT_KEY");
if (!_JWT_KEY) {
  throw new Error("缺少环境变量: _JWT_KEY");
}
export const JWT_KEY = await crypto.subtle.importKey(
  "raw",
  base64.decode(_JWT_KEY),
  { name: "HMAC", hash: "SHA-256" }, // HS256
  false,
  ["sign", "verify"],
);
