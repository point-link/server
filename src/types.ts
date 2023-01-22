import { Bson, djwt, ObjectId } from "./deps.ts";

export interface JwtPayload extends djwt.Payload {
  uid: number;
  username: string;
}

export interface MongoObject {
  _id: ObjectId;
}

export type MongoIdOmitted<T extends MongoObject> = Omit<T, "_id">;

export interface Account extends MongoObject {
  uid: number;
  username: string;
  password: Bson.Binary;
  salt: Bson.Binary;
  profile: {
    avatar?: string;
    nickname?: string;
  };
}

export interface Friend extends MongoObject {
  selfUid: number;
  friendUid: number;
  tags: string[];
  remark?: string;
  description?: string;
}

export interface Client extends MongoObject {
  uid: number;
  status: "online" | "offline";
  recentHeartbeat: number;
  ipv4?: string;
  ipv6?: string;
}

/**
 * 好友请求的状态。
 * 1：等待，
 * 2：取消，
 * 3：同意，
 * 4：拒绝。
 */
export type FriendRequestStatus = 1 | 2 | 3 | 4;

export interface FriendRequest extends MongoObject {
  requesterUid: number;
  targetUid: number;
  status: FriendRequestStatus;
  description?: string;
}

export interface HeartbeatWsData {
  type: "heartbeat";
}

export interface ActionWsData {
  type: "action";
  action: "login" | "logout";
}

export interface NetworkWsData {
  type: "network";
  ipv4?: string;
  ipv6?: string;
}

export type WsData = HeartbeatWsData | ActionWsData | NetworkWsData;
