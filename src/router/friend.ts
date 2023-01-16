import type { Account } from "../types.ts";
import { oak } from "../deps.ts";
import { jwt } from "../middleware/jwt.ts";
import { findFriends } from "../dao/friend.ts";
import { findAccountsByUidArr } from "../dao/account.ts";

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
  const data = friends.map((f) => ({
    uid: f.friendUid,
    tags: f.tags,
    remark: f.remark,
    description: f.description,
    profile: map.get(f.friendUid)?.profile,
  }));
  // 响应
  ctx.response.body = data;
});

export default router;
