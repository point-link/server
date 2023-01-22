import type { Client } from "../types.ts";
import db from "./_db.ts";

const collection = db.collection<Client>("client");

export async function createClient(uid: number) {
  return await collection.insertOne({
    uid,
    status: "offline",
    recentHeartbeat: 0,
  });
}

export async function findClient(uid: number) {
  return await collection.findOne({ uid });
}

export async function updateClientStatus(
  uid: number,
  status: "online" | "offline",
) {
  return await collection.updateOne(
    { uid },
    { $set: { status } },
  );
}

export async function updateClientRecentHeartbeat(
  uid: number,
  heartbeat: number,
) {
  return await collection.updateOne(
    { uid },
    { $set: { recentHeartbeat: heartbeat } },
  );
}

export async function updateClientNetwork(
  uid: number,
  ipv4?: string,
  ipv6?: string,
) {
  return await collection.updateOne(
    { uid },
    { $set: { ipv4, ipv6 } },
  );
}
