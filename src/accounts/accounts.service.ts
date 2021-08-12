import { accountsCollection } from "../database/database.service";
import { Account } from "../models/account";

const newCustomerPerks = [
  {
    code: "5OFF",
    description: "5% off entire sale",
  },
];

export const findAccountById = async (id: string): Promise<Account | null> => {
  const account = accountsCollection.find({ id }).value();

  return account ? account : null;
};

export const findAccountByCustomerId = async (
  id: string
): Promise<Account | null> => {
  const account = accountsCollection.find({ customerId: id }).value();

  return account ? account : null;
};

export const createAccount = async (customerId: string): Promise<Account> => {
  const timeInMS = new Date().getTime();

  const newAccount: Account = {
    id: timeInMS.toString(),
    customerId,
    createdAt: timeInMS,
    balance: 0,
    perks: newCustomerPerks,
  };

  accountsCollection.push(newAccount).write();

  return newAccount;
};

export const adjustBalance = async (
  id: string,
  points: number
): Promise<number | null> => {
  const account = await findAccountById(id);

  if (account) {
    const newBalance = account.balance + points;

    accountsCollection.find({ id }).assign({ balance: newBalance }).write();

    return newBalance;
  }

  return null;
};
