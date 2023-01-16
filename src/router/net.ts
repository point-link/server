import { oak } from "../deps.ts";

const router = new oak.Router();

/**
 * 查询当前 HTTP 请求的 IP
 */
router.get("/ip", (ctx) => {
  // 响应
  ctx.response.body = {
    ip: ctx.request.ip,
  };
});

export default router;
