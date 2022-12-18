// deno-lint-ignore-file no-explicit-any

import type { MaybeMongoObject, MongoObject } from "../types.ts";
import { ObjectId } from "../deps.ts";

export function isString(value: any): value is string {
  return typeof value === "string";
}

export function isMongoObject(value: any): value is MongoObject {
  return value?._id instanceof ObjectId;
}

export function isMaybeMongoObject(value: any): value is MaybeMongoObject {
  if (typeof value !== "object") {
    return false;
  }
  return value._id === undefined || value._id instanceof ObjectId;
}

export function isTypedArray<T>(
  value: any,
  predicate: (v: any) => v is T,
): value is T[] {
  if (!(value instanceof Array)) {
    return false;
  }
  for (const item of value) {
    if (!predicate(item)) {
      return false;
    }
  }
  return true;
}

export function isStringArray(value: any): value is string[] {
  return isTypedArray(value, isString);
}
