import { oak } from "../deps.ts";
import { verifyJwt } from "../util/auth.ts";
import { asyncIgnoreError } from "../util/plain.ts";
import { omitMongoId } from "../util/type.ts";
import friendDao from "../db/dao/friend.ts";

const router = new oak.Router();

/**
 * 获取好友
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
  // 查询好友
  const friends = await friendDao.findFriends(payload.uid);
  // 响应
  ctx.response.body = friends.map(omitMongoId);
});

export default router;
