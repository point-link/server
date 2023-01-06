import type { FriendRequest, FriendRequestStatus } from "../../types.ts";
import { Collection } from "../../deps.ts";
import db from "../db.ts";

class FriendDao {
  #collection: Collection<FriendRequest> = db.collection("friend_request");

  async findByRequester(requesterUid: number, status?: FriendRequestStatus) {
    const filter = status ? { requesterUid, status } : { requesterUid };
    return await this.#collection.find(filter).toArray();
  }

  async findByTarget(targetUid: number, status?: FriendRequestStatus) {
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
      status: 1,
      description,
    });
  }

  async updateStatus(
    requesterUid: number,
    targetUid: number,
    action: "agree" | "reject",
  ) {
    const { modifiedCount } = await this.#collection.updateOne(
      { requesterUid, targetUid, status: 1 },
      { $set: { status: action === "agree" ? 3 : 4 } },
    );
    return modifiedCount === 1;
  }
}

export default new FriendDao();
