import { oak } from "../deps.ts";
import { jwt } from "../middleware/jwt.ts";
import { omitMongoId } from "../util/type.ts";
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
  // 响应
  ctx.response.body = requests.map(omitMongoId);
});

/**
 * 同意或拒绝好友请求
 */
router.put("/", jwt(), async (ctx) => {
  // 获取参数
  const targetUid = ctx.state.jwt.payload.uid;
  const action = ctx.request.url.searchParams.get("action");
  if (action !== "agree" && action !== "reject") {
    ctx.response.status = 400;
    return;
  }
  const requesterUid = Number(ctx.request.url.searchParams.get("requesterUid"));
  if (isNaN(requesterUid)) {
    ctx.response.status = 400;
    return;
  }
  // 改变好友请求的状态
  const ok = await updateFriendRequestStatus(
    requesterUid,
    targetUid,
    action,
  );
  if (!ok) {
    ctx.response.status = 404;
    return;
  }
  // 创建好友关系
  createFriendship(requesterUid, targetUid);
  // 响应
  ctx.response.status = 200;
});

export default router;
