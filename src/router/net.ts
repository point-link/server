import { oak } from "../deps.ts";

const router = new oak.Router();

/**
 * 查询当前 HTTP 请求的 IP
 */
router.get("/ip", (ctx) => {
  // IPv6 转 IPv4
  let ip = ctx.request.ip;
  if (ip.startsWith("::ffff:")) {
    ip = ip.replace("::ffff:", "");
  }
  // 响应
  ctx.response.body = { ip };
});

export default router;
