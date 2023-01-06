import { base64, load } from "./deps.ts";

// 加载 .env 文件中的配置到环境变量
await load({ export: true });

// DB_HOST
const _DB_HOST = Deno.env.get("DB_HOST");
if (!_DB_HOST) {
  throw new Error("缺少环境变量: DB_HOST");
}
export const DB_HOST = _DB_HOST;

// DB_NAME
const _DB_NAME = Deno.env.get("DB_NAME");
if (!_DB_NAME) {
  throw new Error("缺少环境变量: DB_NAME");
}
export const DB_NAME = _DB_NAME;

// DB_USERNAME
const _DB_USERNAME = Deno.env.get("DB_USERNAME");
if (!_DB_USERNAME) {
  throw new Error("缺少环境变量: DB_USERNAME");
}
export const DB_USERNAME = _DB_USERNAME;

// DB_PASSWORD
const _DB_PASSWORD = Deno.env.get("DB_PASSWORD");
if (!_DB_PASSWORD) {
  throw new Error("缺少环境变量: DB_PASSWORD");
}
export const DB_PASSWORD = _DB_PASSWORD;

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
