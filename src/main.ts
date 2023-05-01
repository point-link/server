import app from "./app.ts";
import output from "./util/output.ts";
import { HTTPS_CERT_PATH, HTTPS_ENABLE, HTTPS_KEY_PATH } from "./config.ts";

if (HTTPS_ENABLE) {
  if (!HTTPS_CERT_PATH || !HTTPS_KEY_PATH) {
    throw new Error("HTTPS 证书或密钥文件路径为空");
  }
  app.listen({
    port: 443,
    cert: Deno.readTextFileSync(HTTPS_CERT_PATH),
    key: Deno.readTextFileSync(HTTPS_KEY_PATH),
  });
  output.info(`正在监听 443 端口`);
} else {
  app.listen({ port: 80 });
  output.info(`正在监听 80 端口`);
}
