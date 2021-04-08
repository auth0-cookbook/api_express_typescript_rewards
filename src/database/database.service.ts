import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Account } from "../accounts/account.";

interface Database {
  accounts: Array<Account>;
}

const adapter = new FileSync<Database>("./src/database/database.json", {
  defaultValue: { accounts: [] },
});

export const database = low(adapter);

export const accountsCollection = database.get("accounts");
