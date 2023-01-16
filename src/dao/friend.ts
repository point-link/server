import type { Friend } from "../types.ts";
import db from "./_db.ts";

const collection = db.collection<Friend>("friend");

/**
 * 查询一个账号的好友。
 * @param uid 账号的 UID
 * @returns 此账号的好友数组
 */
export async function findFriends(uid: number) {
  return await collection.find({ selfUid: uid }).toArray();
}

/**
 * 创建两个账户间的好友关系。
 * @param uid1 账号1
 * @param uid2 账号2
 */
export async function createFriendship(uid1: number, uid2: number) {
  await collection.insertMany([
    { selfUid: uid1, friendUid: uid2, tags: [] },
    { selfUid: uid2, friendUid: uid1, tags: [] },
  ]);
}
