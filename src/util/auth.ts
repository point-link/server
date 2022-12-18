import type { JwtPayload } from "../types.ts";
import { Bson, djwt } from "../deps.ts";
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from "../config.ts";
import { blake3 } from "./plain.ts";

function uint8ArrayEqual(arr1: Uint8Array, arr2: Uint8Array) {
  const n = arr1.length;
  if (n != arr2.length) {
    return false;
  }
  for (let i = 0; i < n; i++) {
    if (arr1[i] != arr2[i]) {
      return false;
    }
  }
  return true;
}

function randomUint8() {
  let num = 0;
  for (let i = 0; i < 8; i++) {
    num <<= 1;
    num |= Math.random() > 0.5 ? 1 : 0;
  }
  return num;
}

function random(length: number) {
  const arr = [];
  for (let i = 0; i < length; i++) {
    arr.push(randomUint8());
  }
  return new Uint8Array(arr);
}

async function generateSalt() {
  return new Bson.Binary(
    await blake3(random(256), String(Date.now())),
  );
}

/**
 * generate salted password
 * @param password raw password string
 * @param salt default: random salt
 * @returns salt and salted password
 */
export async function generateSaltedPassword(
  password: string,
  salt?: Bson.Binary,
) {
  if (!salt) {
    salt = await generateSalt();
  }
  const saltedPassword = new Bson.Binary(await blake3(password, salt.buffer));
  return { salt, saltedPassword };
}

export async function correctPassword(
  rawPassword: string,
  salt: Bson.Binary,
  saltedPassword: Bson.Binary,
) {
  return uint8ArrayEqual(
    saltedPassword.buffer,
    (await generateSaltedPassword(rawPassword, salt)).saltedPassword.buffer,
  );
}

/**
 * @param duration in milliseconds, exp = Math.round((Date.now() + duration) / 1000)
 * @param payload JWT payload
 * @returns JWT
 */
export async function signJwt(
  duration: number,
  payload: JwtPayload,
) {
  return await djwt.create(
    { alg: "ES256", typ: "JWT" },
    {
      exp: Math.round((Date.now() + duration) / 1000),
      ...payload,
    },
    JWT_PRIVATE_KEY,
  );
}

export async function verifyJwt(
  jwt: string,
  payloadValidator?: Partial<JwtPayload>,
) {
  const payload = await djwt.verify(jwt, JWT_PUBLIC_KEY) as JwtPayload;
  if (payloadValidator) {
    for (const key of Object.keys(payloadValidator)) {
      if (payloadValidator[key] !== payload[key]) {
        throw new Error("JWT payload is invalid");
      }
    }
  }
  return payload;
}
