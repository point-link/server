import type { Friend } from "../../types.ts";
import { Collection } from "../../deps.ts";
import db from "../db.ts";

class FriendDao {
  #collection: Collection<Friend> = db.collection("friend");

  async findFriends(uid: number) {
    return await this.#collection.find({ selfUid: uid }).toArray();
  }

  async createFriendship(uid1: number, uid2: number) {
    await this.#collection.insertMany([
      { selfUid: uid1, friendUid: uid2, tags: [] },
      { selfUid: uid2, friendUid: uid1, tags: [] },
    ]);
  }
}

export default new FriendDao();
