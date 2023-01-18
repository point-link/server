import { oak, oakCors } from "./deps.ts";
import logger from "./middleware/logger.ts";
import router from "./router/index.ts";

const app = new oak.Application();

// 日志
app.use(logger());
// 跨域
app.use(oakCors({
  origin: [
    "https://api.pointlink.top",
  ],
}));
// 路由
app.use(router.routes(), router.allowedMethods());

export default app;
