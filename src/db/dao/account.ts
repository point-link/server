import type { Account, AccountSchema } from "../../types.ts";
import { Collection } from "../../deps.ts";
import db from "../db.ts";

class AccountDao {
  #collection: Collection<AccountSchema>;

  constructor(collection: Collection<AccountSchema>) {
    this.#collection = collection;
  }

  async findOne(username: string) {
    return await this.#collection.findOne({ username });
  }

  async insertOne(user: Account) {
    return await this.#collection.insertOne(user);
  }
}

const accountDao = new AccountDao(db.collection<AccountSchema>("account"));

export default accountDao;
