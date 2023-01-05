import type { FriendRequest } from "../../types.ts";
import { Collection } from "../../deps.ts";
import db from "../db.ts";

class FriendDao {
  #collection: Collection<FriendRequest> = db.collection("friend_request");

  async findPendingRequests(uid: number) {
    return await this.#collection.find({ selfUid: uid, status: 10 }).toArray();
  }

  async createRequest(
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
