import { oak } from "../deps.ts";
import { verifyJwt } from "../util/auth.ts";
import { asyncIgnoreError } from "../util/plain.ts";
import { omitMongoId } from "../util/type.ts";
import friendRequestDao from "../db/dao/friend_request.ts";

const router = new oak.Router();

/**
 * 创建好友请求
 */
router.post("/", async (ctx) => {
  // 验证 token
  const token = ctx.request.headers.get("x-auth-token");
  if (!token) {
    ctx.response.status = 401;
    return;
  }
  const payload = await asyncIgnoreError(
    () => verifyJwt(token),
  );
  if (!payload) {
    ctx.response.status = 403;
    return;
  }
  // 获取参数
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
  await friendRequestDao.createRequest(payload.uid, targetUid, description);
  // 响应
  ctx.response.status = 200;
});

/**
 * 查询好友请求
 */
router.get("/", async (ctx) => {
  // 验证 token
  const token = ctx.request.headers.get("x-auth-token");
  if (!token) {
    ctx.response.status = 401;
    return;
  }
  const payload = await asyncIgnoreError(
    () => verifyJwt(token),
  );
  if (!payload) {
    ctx.response.status = 403;
    return;
  }
  // 获取参数
  const _status = ctx.request.url.searchParams.get("status");
  const status = _status ? Number(_status) : undefined;
  const type = ctx.request.url.searchParams.get("type");
  if (
    typeof status === "number" &&
    !(status === 10 || status === 20 || status === 30)
  ) {
    ctx.response.status = 400;
    return;
  }
  if (type !== "requester" && type !== "target") {
    ctx.response.status = 400;
    return;
  }
  // 查询好友请求
  const uid = payload.uid;
  const requests = type === "requester"
    ? await friendRequestDao.findByRequester(uid, status)
    : await friendRequestDao.findByTarget(uid, status);
  // 响应
  ctx.response.body = requests.map(omitMongoId);
});

export default router;
