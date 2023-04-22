import type { LoginWsData, WsInData } from "../types.ts";
import { oak } from "../deps.ts";
import {
  findOnlineClients,
  updateClientNetwork,
  updateClientRecentHeartbeat,
  updateClientStatus,
} from "../dao/client.ts";
import { findFriends } from "../dao/friend.ts";
import { jwt } from "../middleware/jwt.ts";
import { syncIgnoreError } from "../util/plain.ts";

const router = new oak.Router();
export const wsMap = new Map<number, WebSocket>(); // uid => ws

async function loginHandler(uid: number, data: LoginWsData) {
  // 更新数据库
  await Promise.all([
    updateClientNetwork(uid, data.ipv4, data.ipv6, data.port),
    updateClientRecentHeartbeat(uid, Date.now()),
    updateClientStatus(uid, "online"),
  ]);
  // 查询在线好友
  const friends = await findFriends(uid);
  const friendUidArr = friends.map((f) => f.friendUid);
  const onlineFriendClients = await findOnlineClients(friendUidArr);
  // 向好友发送上线通知
  for (const c of onlineFriendClients) {
    const friendWs = wsMap.get(c.uid);
    if (!friendWs) {
      continue;
    }
    friendWs.send(JSON.stringify({
      type: "friend-login",
      uid,
      ipv4: data.ipv4,
      ipv6: data.ipv6,
      port: data.port,
    }));
  }
}

async function logoutHandler(uid: number) {
  // 更新数据库
  await updateClientStatus(uid, "offline");
  // 查询在线好友
  const friends = await findFriends(uid);
  const friendUidArr = friends.map((f) => f.friendUid);
  const onlineFriendClients = await findOnlineClients(friendUidArr);
  // 向好友发送下线通知
  for (const c of onlineFriendClients) {
    const friendWs = wsMap.get(c.uid);
    if (!friendWs) {
      continue;
    }
    friendWs.send(JSON.stringify({
      type: "friend-logout",
      uid,
    }));
  }
}

async function onmessage(uid: number, data: WsInData) {
  switch (data.type) {
    case "heartbeat":
      await updateClientRecentHeartbeat(uid, Date.now());
      break;
    case "network":
      await updateClientNetwork(uid, data.ipv4, data.ipv6, data.port);
      break;
    case "login":
      await loginHandler(uid, data);
      break;
    case "logout":
      await logoutHandler(uid);
      break;
  }
}

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
  ws.onopen = () => wsMap.set(uid, ws);
  ws.onclose = () => wsMap.delete(uid);
  ws.onerror = (event) => console.log(event);
  ws.onmessage = async (event) => {
    const data = syncIgnoreError(() => JSON.parse(event.data) as WsInData);
    if (data) {
      await onmessage(uid, data);
    }
  };
  // 升级为 WebSocket 后响应状态自动设为 101，此处无需再设置
});

export default router;
