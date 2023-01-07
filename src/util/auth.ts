import type { JwtPayload } from "../types.ts";
import { Bson, djwt } from "../deps.ts";
import { JWT_PRIVATE_KEY, JWT_PUBLIC_KEY } from "../config.ts";
import { blake3 } from "./plain.ts";

/**
 * 比较两个 Uint8Array 的值是否一致。
 * @param arr1 数组 1
 * @param arr2 数组 2
 * @returns 两个 Uint8Array 的值是否一致
 */
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

/**
 * 生成加盐后的密码摘要
 * @param password 原始密码字符串
 * @param salt 盐值（默认：随机盐值）
 * @returns 盐值与加盐后的密码摘要
 */
export async function generateSaltedPassword(
  password: string,
  salt?: Bson.Binary,
) {
  if (!salt) {
    // 生成随机盐值
    salt = new Bson.Binary(
      crypto.getRandomValues(new Uint8Array(32)), // 32 字节
    );
  }
  const saltedPassword = new Bson.Binary(await blake3(password, salt.buffer));
  return { salt, saltedPassword };
}

/**
 * 校验原始密码。
 * @param rawPassword 原始密码字符串
 * @param salt 盐值
 * @param saltedPassword 加盐后的密码摘要
 * @returns 原始密码是否正确
 */
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
 * 签发 JWT。
 * @param duration 有效时长（单位：秒）
 * @param payload 负载数据
 * @returns JWT
 */
export async function signJwt(
  duration: number,
  payload: JwtPayload,
) {
  const now = Math.floor(Date.now() / 1000);
  return await djwt.create(
    { alg: "ES256", typ: "JWT" },
    {
      ...payload,
      nbf: now,
      exp: now + Math.floor(duration),
    },
    JWT_PRIVATE_KEY,
  );
}

/**
 * 验证 JWT。
 * @param jwt JWT
 * @returns 若验证成功，则返回 JWT 的负载数据；若验证失败，则返回 undefined。
 */
export async function verifyJwt(jwt: string) {
  try {
    return await djwt.verify(jwt, JWT_PUBLIC_KEY) as JwtPayload;
  } catch (_) {
    return;
  }
}
