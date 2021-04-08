import { Account } from "./account.";
import { accountsCollection } from "../database/database.service";

export const findAllAccounts = async () => {
  return accountsCollection.value();
};

export const findAccountById = async (id: number) => {
  return accountsCollection.find({ id }).value();
};

export const createAccount = async (customerId: number) => {
  const timeInMS = new Date().getTime();

  const newAccount: Account = {
    customerId,
    id: timeInMS,
    createdAt: timeInMS,
    balance: 0,
    perks: [],
  };

  accountsCollection.push(newAccount).write();
};
