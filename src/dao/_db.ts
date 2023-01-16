import { MongoClient } from "../deps.ts";
import { DB_URI } from "../config.ts";
import output from "../util/output.ts";

output.info(`正在连接数据库`);
const db = await new MongoClient().connect(DB_URI);

export default db;
