import low from "lowdb";
import FileSync from "lowdb/adapters/FileSync";
import { Account } from "../models/account";
import { Customer } from "../models/customer";

interface Database {
  accounts: Array<Account>;
  customers: Array<Customer>;
}

const adapter = new FileSync<Database>("./src/database/database.json", {
  defaultValue: { accounts: [], customers: [] },
});

export const database = low(adapter);

export const accountsCollection = database.get("accounts");
export const customersCollection = database.get("customers");
