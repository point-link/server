import type { Account } from "../types.ts";
import { oak } from "../deps.ts";
import { jwt } from "../middleware/jwt.ts";
import { findAccountsByUidArr } from "../dao/account.ts";
import {
  createFriendRequest,
  findFriendRequestsByRequester,
  findFriendRequestsByTarget,
  updateFriendRequestStatus,
} from "../dao/friend_request.ts";
import { createFriendship } from "../dao/friend.ts";

const router = new oak.Router();

/**
 * 创建好友请求
 */
router.post("/", jwt(), async (ctx) => {
  // 获取参数
  const uid = ctx.state.jwt.payload.uid;
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.response.status = 400;
    return;
  }
  const targetUid = (await body.value)?.targetUid;
  const description = (await body.value)?.description;
  if (
    typeof targetUid !== "number" ||
    (typeof description !== "string" && typeof description !== "undefined")
  ) {
    ctx.response.status = 400;
    return;
  }
  // 创建请求
  await createFriendRequest(uid, targetUid, description);
  // 响应
  ctx.response.status = 200;
});

/**
 * 查询好友请求
 */
router.get("/", jwt(), async (ctx) => {
  // 获取参数
  const uid = ctx.state.jwt.payload.uid;
  const _status = ctx.request.url.searchParams.get("status");
  const status = _status ? Number(_status) : undefined;
  const type = ctx.request.url.searchParams.get("type");
  if (
    typeof status === "number" &&
    !(status === 1 || status === 2 || status === 3 || status === 4)
  ) {
    ctx.response.status = 400;
    return;
  }
  if (type !== "requester" && type !== "target") {
    ctx.response.status = 400;
    return;
  }
  // 查询好友请求
  const requests = type === "requester"
    ? await findFriendRequestsByRequester(uid, status)
    : await findFriendRequestsByTarget(uid, status);
  // 构建响应数据
  const uidArr: number[] = [];
  for (const request of requests) {
    uidArr.push(request.requesterUid);
    uidArr.push(request.targetUid);
  }
  const accounts = await findAccountsByUidArr(uidArr);
  const map = new Map<number, Account>();
  for (const account of accounts) {
    map.set(account.uid, account);
  }
  const data = [];
  for (const request of requests) {
    const requester = map.get(request.requesterUid);
    const target = map.get(request.targetUid);
    if (!(requester && target)) {
      continue;
    }
    data.push({
      requester: {
        uid: requester.uid,
        username: requester.username,
        profile: requester.profile,
      },
      target: {
        uid: target.uid,
        username: target.username,
        profile: target.profile,
      },
      status: request.status,
      description: request.description,
    });
  }
  // 响应
  ctx.response.body = data;
});

/**
 * 取消、同意或拒绝好友请求
 */
router.put("/", jwt(), async (ctx) => {
  // 获取参数
  const role = ctx.request.url.searchParams.get("role");
  if (role !== "requester" && role !== "target") {
    ctx.response.status = 400;
    return;
  }
  const action = ctx.request.url.searchParams.get("action");
  if (action !== "cancel" && action !== "agree" && action !== "reject") {
    ctx.response.status = 400;
    return;
  }
  if (
    (role === "requester" && action !== "cancel") ||
    (role === "target" && action !== "agree" && action !== "reject")
  ) {
    ctx.response.status = 400;
    return;
  }
  const associatedUid = Number(
    ctx.request.url.searchParams.get("associatedUid"),
  );
  if (isNaN(associatedUid)) {
    ctx.response.status = 400;
    return;
  }
  const selfUid = ctx.state.jwt.payload.uid;
  const requesterUid = role === "requester" ? selfUid : associatedUid;
  const targetUid = role === "target" ? selfUid : associatedUid;
  // 改变好友请求的状态
  const updated = await updateFriendRequestStatus(
    requesterUid,
    targetUid,
    action,
  );
  if (!updated) {
    ctx.response.status = 404;
    return;
  }
  // 创建好友关系
  if (action === "agree") {
    await createFriendship(requesterUid, targetUid);
  }
  // 响应
  ctx.response.status = 200;
});

export default router;
