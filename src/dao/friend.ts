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
 * 更新好友信息。
 * @param uid 自己的 UID
 * @param friendUid 好友的 UID
 * @param remark 备注
 * @param tags 标签
 * @returns 是否成功更新
 */
export async function updateFriendInfo(
  uid: number,
  friendUid: number,
  remark: string | undefined,
  tags: string[],
) {
  const { modifiedCount } = await collection.updateOne(
    { selfUid: uid, friendUid },
    { $set: { remark, tags } },
  );
  return modifiedCount === 1;
}

/**
 * 创建两个账号间的好友关系。
 * @param uid1 账号1
 * @param uid2 账号2
 */
export async function createFriendship(uid1: number, uid2: number) {
  await collection.insertMany([
    { selfUid: uid1, friendUid: uid2, tags: [] },
    { selfUid: uid2, friendUid: uid1, tags: [] },
  ]);
}

/**
 * 删除两个账户间的好友关系
 * @param uid1 账号1
 * @param uid2 账号2
 * @returns 是否成功删除
 */
export async function deleteFriendship(uid1: number, uid2: number) {
  const num = await collection.deleteMany({
    $or: [
      { selfUid: uid1, friendUid: uid2 },
      { selfUid: uid2, friendUid: uid1 },
    ],
  });
  return num === 2;
}
