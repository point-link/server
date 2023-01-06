import type { JwtPayload } from "../types.ts";
import { oak } from "../deps.ts";
import { verifyJwt } from "../util/auth.ts";

interface JwtState {
  jwt: {
    token: string;
    payload: JwtPayload;
  };
}

export function jwt(): oak.Middleware<JwtState> {
  return async (ctx, next) => {
    // 从请求头中获取 token
    const token = ctx.request.headers.get("x-auth-token");
    if (!token) {
      ctx.response.status = 401;
      return;
    }
    // 验证 token
    const payload = await verifyJwt(token);
    if (!payload) {
      ctx.response.status = 403;
      return;
    }
    // 设置 ctx.state
    ctx.state.jwt = {
      token,
      payload,
    };
    // 下一中间件
    await next();
  };
}

export default jwt;
