import type { FriendRequest } from "../../types.ts";
import { Collection } from "../../deps.ts";
import db from "../db.ts";

class FriendDao {
  #collection: Collection<FriendRequest> = db.collection("friend_request");

  async findByRequester(requesterUid: number, status?: 10 | 20 | 30) {
    const filter = status ? { requesterUid, status } : { requesterUid };
    return await this.#collection.find(filter).toArray();
  }

  async findByTarget(targetUid: number, status?: 10 | 20 | 30) {
    const filter = status ? { targetUid, status } : { targetUid };
    return await this.#collection.find(filter).toArray();
  }

  async createOne(
    requesterUid: number,
    targetUid: number,
    description?: string,
  ) {
    await this.#collection.insertOne({
      requesterUid,
      targetUid,
      status: 10,
      description,
    });
  }
}

export default new FriendDao();
