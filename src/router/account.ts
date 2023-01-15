import { oak } from "../deps.ts";
import accountDao from "../db/dao/account.ts";
import {
  correctPassword,
  generateSaltedPassword,
  signJwt,
} from "../util/auth.ts";

const router = new oak.Router();

/**
 * 创建账号
 */
router.post("/", async (ctx) => {
  // 获取参数
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.response.status = 400;
    return;
  }
  const username = (await body.value)?.username;
  const password = (await body.value)?.password;
  if (typeof username !== "string" || typeof password !== "string") {
    ctx.response.status = 400;
    return;
  }
  // 生成加盐密码
  const { saltedPassword, salt } = await generateSaltedPassword(password);
  // 创建账号并响应
  try {
    await accountDao.createOne(username, saltedPassword, salt);
    ctx.response.status = 200;
  } catch (_) {
    ctx.response.status = 403;
  }
});

/**
 * 获取账号资料
 */
router.get("/profile/:uid", async (ctx) => {
  // 获取参数
  const uid = Number(ctx.params.uid);
  if (isNaN(uid)) {
    ctx.response.status = 400;
    return;
  }
  // 获取账号资料
  const account = await accountDao.findOneByUid(uid);
  // 响应
  if (account) {
    ctx.response.body = account.profile;
  } else {
    ctx.response.status = 404;
  }
});

/**
 * 登录
 */
router.post("/login", async (ctx) => {
  // 获取参数
  const body = ctx.request.body();
  if (body.type !== "json") {
    ctx.response.status = 400;
    return;
  }
  const username = (await body.value)?.username;
  const password = (await body.value)?.password;
  if (typeof username !== "string" || typeof password !== "string") {
    ctx.response.status = 400;
    return;
  }
  // 查找账号
  const account = await accountDao.findOneByUsername(username);
  if (!account) {
    ctx.response.status = 404;
    return;
  }
  // 校验密码
  if (!await correctPassword(password, account.salt, account.password)) {
    ctx.response.status = 403;
    return;
  }
  // 签发 token
  const token = await signJwt(
    3 * 24 * 60 * 60, // 有效时长为 3 天
    {
      uid: account.uid,
      username: account.username,
    },
  );
  // 响应
  ctx.response.body = {
    token,
    account: {
      uid: account.uid,
      profile: account.profile,
    },
  };
});

export default router;
