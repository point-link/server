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

export interface FriendRequest extends MongoObject {
  requesterUid: number;
  targetUid: number;
  status: 10 | 20 | 30; // 10：等待，20：同意，30：拒绝
  description?: string;
}
