import { Bson, djwt, ObjectId } from "./deps.ts";

export interface JwtPayload extends djwt.Payload {
  uid: number;
  username: string;
}

export interface MongoObject {
  _id: ObjectId;
}

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
