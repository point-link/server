import { Bson, djwt, ObjectId } from "./deps.ts";

export interface MongoObject {
  _id: ObjectId;
}

export interface MaybeMongoObject {
  _id?: ObjectId;
}

export interface Account {
  username: string;
  password: Bson.Binary;
  salt: Bson.Binary;
}

export type AccountSchema = Account & MongoObject;

export type MaybeAccountSchema = Account & MaybeMongoObject;

export interface JwtPayload extends djwt.Payload {
  username: string;
}
