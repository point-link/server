import { oak } from "../deps.ts";
import { verifyJwt } from "../util/auth.ts";
import { asyncIgnoreError } from "../util/plain.ts";
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

export default router;
