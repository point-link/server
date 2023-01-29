import type { Account } from "../types.ts";
import { oak } from "../deps.ts";
import { jwt } from "../middleware/jwt.ts";
import { findFriends } from "../dao/friend.ts";
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

export default router;
