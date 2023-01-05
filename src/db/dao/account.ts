import type { Account } from "../../types.ts";
import { Bson, Collection } from "../../deps.ts";
import db from "../db.ts";

class AccountDao {
  #collection: Collection<Account> = db.collection("account");

  async findOneByUid(uid: number) {
    return await this.#collection.findOne({ uid });
  }

  async findOneByUsername(username: string) {
    return await this.#collection.findOne({ username });
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

export default new AccountDao();
