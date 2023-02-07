import type { Account } from "../types.ts";
import { oak } from "../deps.ts";
import { jwt } from "../middleware/jwt.ts";
import { findFriends, updateFriendInfo } from "../dao/friend.ts";
import { findAccountsByUidArr } from "../dao/account.ts";
import { findOnlineClients } from "../dao/client.ts";

const router = new oak.Router();

/**
 * 获取好友
 */
router.get("/", jwt(), async (ctx) => {
  // 获取参数
  const uid = ctx.state.jwt.payload.uid;
  // 查询好友
  const friends = await findFriends(uid);
  // 构建响应数据
  const friendUidArr = friends.map((f) => f.friendUid);
  const friendAccounts = await findAccountsByUidArr(friendUidArr);
  const map = new Map<number, Account>();
  for (const account of friendAccounts) {
    map.set(account.uid, account);
  }
  const data = [];
  for (const friend of friends) {
    const friendAccount = map.get(friend.friendUid);
    if (!friendAccount) {
      continue;
    }
    data.push({
      uid: friend.friendUid,
      tags: friend.tags,
      remark: friend.remark,
      description: friend.description,
      username: friendAccount.username,
      profile: friendAccount.profile,
    });
  }
  // 响应
  ctx.response.body = data;
});

/**
 * 获取在线好友的客户端信息
 */
router.get("/online_client", jwt(), async (ctx) => {
  // 获取参数
  const uid = ctx.state.jwt.payload.uid;
  // 查询在线好友的客户端信息
  const friends = await findFriends(uid);
  const friendUidArr = friends.map((f) => f.friendUid);
  const onlineFriendClients = await findOnlineClients(friendUidArr);
  // 构建响应数据
  const data = onlineFriendClients.map((c) => ({
    uid: c.uid,
    ipv4: c.ipv4,
    ipv6: c.ipv6,
    port: c.port,
  }));
  // 响应
  ctx.response.body = data;
});

/**
 * 更新好友信息
 */
router.put("/info", jwt(), async (ctx) => {
  // 获取参数
  const uid = ctx.state.jwt.payload.uid;
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.response.status = 400;
    return;
  }
  const friendUid = (await body.value)?.friendUid;
  const remark = (await body.value)?.remark;
  const tags = (await body.value)?.tags;
  // 更新好友信息
  const updated = await updateFriendInfo(uid, friendUid!, remark!, tags!); // TODO: 完善数据校验
  if (!updated) {
    ctx.response.status = 400;
    return;
  }
  // 响应
  ctx.response.status = 200;
});

export default router;
