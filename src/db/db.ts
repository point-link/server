import { MongoClient } from "../deps.ts";
import { DB_HOST, DB_NAME, DB_PASSWORD, DB_USERNAME } from "../config.ts";
import output from "../util/output.ts";

output.info(`Connecting to MongoDB...`);

const client = new MongoClient();
const uri =
  `mongodb+srv://${DB_USERNAME}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?retryWrites=true&w=majority&authMechanism=SCRAM-SHA-1`;
const db = await client.connect(uri);

export default db;
