import type { JwtPayload } from "../types.ts";
import { oak } from "../deps.ts";
import { asyncIgnoreError } from "../util/plain.ts";
import { verifyJwt } from "../util/auth.ts";

interface JwtState {
  jwt: {
    token: string;
    payload: JwtPayload;
  };
}

export function jwt(
  payloadValidator?: Partial<JwtPayload>,
): oak.Middleware<JwtState> {
  return async (ctx, next) => {
    // get jwt
    const token = ctx.request.headers.get("x-auth-token");
    if (!token) {
      ctx.response.status = 401;
      return;
    }
    // verify jwt
    const payload = await asyncIgnoreError(async () =>
      await verifyJwt(token, payloadValidator)
    );
    if (!payload) {
      ctx.response.status = 403;
      return;
    }
    // set ctx.state
    ctx.state.jwt = {
      token,
      payload,
    };
    // next middleware
    await next();
  };
}

export default jwt;
