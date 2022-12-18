import { base64, config } from "./deps.ts";

const dotenv = await config();

export const DB_HOST = Deno.env.get("DB_HOST") ||
  dotenv["DB_HOST"];

export const DB_NAME = Deno.env.get("DB_NAME") || dotenv["DB_NAME"];

export const DB_USERNAME = Deno.env.get("DB_USERNAME") || dotenv["DB_USERNAME"];

export const DB_PASSWORD = Deno.env.get("DB_PASSWORD") || dotenv["DB_PASSWORD"];

export const JWT_PRIVATE_KEY = await crypto.subtle.importKey(
  "pkcs8",
  base64.decode(
    Deno.env.get("JWT_PRIVATE_KEY") ||
      dotenv["JWT_PRIVATE_KEY"],
  ),
  {
    name: "ECDSA",
    namedCurve: "P-256",
  },
  false,
  ["sign"],
);

export const JWT_PUBLIC_KEY = await crypto.subtle.importKey(
  "spki",
  base64.decode(
    Deno.env.get("JWT_PUBLIC_KEY") ||
      dotenv["JWT_PUBLIC_KEY"],
  ),
  {
    name: "ECDSA",
    namedCurve: "P-256",
  },
  false,
  ["verify"],
);
