import type { WsData } from "../types.ts";
import { oak } from "../deps.ts";
import {
  updateClientNetwork,
  updateClientRecentHeartbeat,
  updateClientStatus,
} from "../dao/client.ts";
import { jwt } from "../middleware/jwt.ts";

const router = new oak.Router();

const wsMap = new Map<number, WebSocket>();

/**
 * 建立 WebSocket 连接
 */
router.get("/", jwt(), (ctx) => {
  // 获取参数
  const uid = ctx.state.jwt.payload.uid;
  // 升级到 WebSocket
  if (!ctx.isUpgradable) {
    ctx.response.status = 400;
    return;
  }
  const ws = ctx.upgrade();
  // 设置 WebSocket 的处理函数
  ws.onopen = () => {
    wsMap.set(uid, ws);
  };
  ws.onmessage = async (event) => {
    const data = event.data as WsData;
    switch (data.type) {
      case "heartbeat":
        await updateClientRecentHeartbeat(uid, Date.now());
        break;
      case "network":
        await updateClientNetwork(uid, data.ipv4, data.ipv6);
        break;
      case "action":
        await updateClientStatus(
          uid,
          data.action === "login" ? "online" : "offline",
        );
        break;
    }
  };
  ws.onclose = () => {
    wsMap.delete(uid);
  };
  ws.onerror = (event) => {
    console.log(event);
  };
  // 响应
  ctx.response.status = 200;
});

export default router;
