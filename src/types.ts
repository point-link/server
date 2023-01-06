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
    avatar: string;
    nickname: string;
  };
}

export interface Friend extends MongoObject {
  selfUid: number;
  friendUid: number;
  tags: string[];
  remark?: string;
  description?: string;
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
