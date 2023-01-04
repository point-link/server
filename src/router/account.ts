import { oak } from "../deps.ts";
import accountDao from "../db/dao/account.ts";
import { generateSaltedPassword } from "../util/auth.ts";

const router = new oak.Router();

/**
 * 创建账号
 */
router.post("/", async (ctx) => {
  // 获取参数
  const body = await ctx.request.body().value;
  const username = body?.username;
  const password = body?.password;
  // 检查参数
  if (typeof username !== "string") {
    ctx.response.status = 400;
    return;
  }
  if (typeof password !== "string") {
    ctx.response.status = 400;
    return;
  }
  // 生成加盐密码
  const { saltedPassword, salt } = await generateSaltedPassword(password);
  // 创建账号
  try {
    await accountDao.createAccount(username, saltedPassword, salt);
    ctx.response.status = 200;
  } catch (_) {
    ctx.response.status = 403;
  }
});

export default router;
