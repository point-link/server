import type { FriendRequest, FriendRequestStatus } from "../types.ts";
import db from "./_db.ts";

const collection = db.collection<FriendRequest>("friend_request");

/**
 * 根据请求人的 UID 查询好友请求。
 * @param requesterUid 请求人的 UID
 * @param status 好友请求的状态（可选，用于筛选查询结果）
 * @returns 好友请求数组
 */
export async function findFriendRequestsByRequester(
  requesterUid: number,
  status?: FriendRequestStatus,
) {
  const filter = status ? { requesterUid, status } : { requesterUid };
  return await collection.find(filter).toArray();
}

/**
 * 根据请求目标的 UID 查询好友请求。
 * @param targetUid 请求目标的 UID
 * @param status 好友请求的状态（可选，用于筛选查询结果）
 * @returns 好友请求数组
 */
export async function findFriendRequestsByTarget(
  targetUid: number,
  status?: FriendRequestStatus,
) {
  const filter = status ? { targetUid, status } : { targetUid };
  return await collection.find(filter).toArray();
}

/**
 * 创建一个好友请求。
 * @param requesterUid 请求人的 UID
 * @param targetUid 请求目标的 UID
 * @param description 好友请求的描述
 */
export async function createFriendRequest(
  requesterUid: number,
  targetUid: number,
  description?: string,
) {
  await collection.insertOne({
    requesterUid,
    targetUid,
    status: 1,
    description,
  });
}

/**
 * 更新好友请求的状态。
 * @param requesterUid 请求人的 UID
 * @param targetUid 请求目标的 UID
 * @param action 对此请求要执行的动作
 * @returns 是否成功更改好友请求状态
 */
export async function updateFriendRequestStatus(
  requesterUid: number,
  targetUid: number,
  action: "cancel" | "agree" | "reject",
) {
  const { modifiedCount } = await collection.updateOne(
    { requesterUid, targetUid, status: 1 },
    { $set: { status: action === "cancel" ? 2 : action === "agree" ? 3 : 4 } },
  );
  return modifiedCount === 1;
}
