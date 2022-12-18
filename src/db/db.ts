import { MongoClient } from "../deps.ts";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from "../config.ts";
import output from "../util/output.ts";

output.info(`Connecting to MongoDB...`);

const query = Object.entries({
  retryWrites: "true",
  w: "majority",
  authMechanism: "SCRAM-SHA-1",
})
  .map(([k, v]) => `${k}=${v}`)
  .join("&");
const uri =
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?${query}`;
const db = await new MongoClient().connect(uri);

export default db;
