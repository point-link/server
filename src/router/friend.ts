import { oak } from "../deps.ts";
import { jwt } from "../middleware/jwt.ts";
import { omitMongoId } from "../util/type.ts";
import { findFriends } from "../dao/friend.ts";

const router = new oak.Router();

/**
 * 获取好友
 */
router.get("/", jwt(), async (ctx) => {
  // 获取参数
  const uid = ctx.state.jwt.payload.uid;
  // 查询好友
  const friends = await findFriends(uid);
  // 响应
  ctx.response.body = friends.map(omitMongoId);
});

export default router;
