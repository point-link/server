import type { AccountSchema } from "../../types.ts";
import { Bson, Collection } from "../../deps.ts";
import db from "../db.ts";

class AccountDao {
  #collection: Collection<AccountSchema>;

  constructor(collection: Collection<AccountSchema>) {
    this.#collection = collection;
  }

  async findOne(uid: number) {
    return await this.#collection.findOne({ uid });
  }

  /**
   * 创建新账号
   * @param username 用户名
   * @param password 密码，应为一个加盐后的二进制数据
   * @param salt 密码的盐值
   */
  async createAccount(
    username: string,
    password: Bson.Binary,
    salt: Bson.Binary,
  ) {
    // 获取新的 UID
    const latestAccount = await this.#collection
      .findOne({}, {
        projection: { uid: 1 },
        sort: { uid: -1 },
      });
    const nextUid = (latestAccount?.uid || 9999) + 1;
    // 创建并插入新账号
    await this.#collection.insertOne({
      uid: nextUid,
      username,
      password,
      salt,
      profile: {
        avatar: "https://i0.hdslb.com/bfs/face/member/noface.jpg",
        nickname: username,
      },
    });
  }
}

export default new AccountDao(
  db.collection<AccountSchema>("account"),
);
