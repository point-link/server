import type { Account } from "../types.ts";
import { Bson } from "../deps.ts";
import db from "./_db.ts";

const collection = db.collection<Account>("account");

/**
 * 根据账号的 UID 查询对应的账号。
 * @param uid 账号的 UID
 * @returns 若找到则返回这个账号对象，否则返回 undefined
 */
export async function findAccountByUid(uid: number) {
  return await collection.findOne({ uid });
}

/**
 * 根据账号的用户名查询对应的账号。
 * @param username 账号的用户名
 * @returns 若找到则返回这个账号对象，否则返回 undefined
 */
export async function findAccountByUsername(username: string) {
  return await collection.findOne({ username });
}

/**
 * 查询一个 UID 数组对应的账号。
 * @param uidArr UID 数组
 * @returns 账号数组
 */
export async function findAccountsByUidArr(uidArr: number[]) {
  return await collection.find({ uid: { $in: uidArr } }).toArray();
}

/**
 * 创建新账号。
 * @param username 用户名
 * @param password 密码，应为一个加盐后的二进制数据
 * @param salt 密码的盐值
 */
export async function createAccount(
  username: string,
  password: Bson.Binary,
  salt: Bson.Binary,
) {
  // 获取新的 UID
  const latestAccount = await collection
    .findOne({}, {
      projection: { uid: 1 },
      sort: { uid: -1 },
    });
  const nextUid = (latestAccount?.uid || 9999) + 1;
  // 创建并插入新账号
  await collection.insertOne({
    uid: nextUid,
    username,
    password,
    salt,
    profile: {},
  });
}
