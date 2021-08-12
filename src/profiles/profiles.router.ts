import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { createAccount, findAccountById } from "../accounts/accounts.service";
import {
  createCustomer,
  findCustomerById,
} from "../customers/customers.service";
import { customersCollection } from "../database/database.service";
import { Account } from "../models/account";
import { NewCustomerPayload } from "src/models/payloads/new-customer-payload";
import { Profile } from "../models/profile";

dotenv.config();

const profilesRouter = express.Router();

profilesRouter.use(auth());

// Retrieve profile

profilesRouter.get(
  "/:customerId",
  async (request: Request<{ customerId: string }>, response: Response) => {
    const customerRecord = await findCustomerById(request.params.customerId);
    let accountRecord: Account | null = null;

    if (!customerRecord) {
      response.sendStatus(404);
      return;
    }

    const customer = {
      customerId: customerRecord.id,
      name: customerRecord.name,
      email: customerRecord.email.value,
      emailVerified: customerRecord.email.verified,
      phoneNumber: customerRecord.phoneNumber.value,
      phoneNumberVerified: customerRecord.phoneNumber.verified,
    };

    const profile: Profile = {
      customer,
    };

    if (!customerRecord.accountId) {
      response.json(profile);
      return;
    }

    accountRecord = await findAccountById(customerRecord.accountId);

    if (!accountRecord) {
      response.sendStatus(500);
      return;
    }

    profile.rewards = {
      accountId: accountRecord.id,
      createdAt: accountRecord.createdAt,
      balance: accountRecord.balance,
      perks: accountRecord.perks,
    };

    response.json(profile);
  }
);

// Create profile

profilesRouter.post(
  "/",
  async (request: Request<{}, {}, NewCustomerPayload>, response: Response) => {
    const newCustomer = request.body;
    const customerId = newCustomer.id;
    const existingCustomer = customersCollection
      .find({ id: customerId })
      .value();

    if (existingCustomer) {
      response.sendStatus(500);
      return;
    }

    const customer = await createCustomer(newCustomer);
    const account = await createAccount(customer.id);

    customersCollection
      .find({ id: customerId })
      .assign({ accountId: account.id })
      .write();

    response.sendStatus(200);
  }
);

module.exports = { profilesRouter };
