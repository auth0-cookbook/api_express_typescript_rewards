import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { UpdateCustomerPayload } from "../models/payloads/update-customer-payload";
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

profilesRouter.use(
  auth({
    issuerBaseURL: process.env.ISSUER_BASE_URL,
    audience: process.env.AUDIENCE,
  })
);

const getProfile = async (customerId: string): Promise<Profile | null> => {
  const customerRecord = await findCustomerById(customerId);
  let accountRecord: Account | null = null;

  if (!customerRecord) {
    return null;
  }

  const customer = {
    customerId: customerRecord.id,
    name: customerRecord.name,
    email: customerRecord.email,
    phoneNumber: customerRecord.phoneNumber,
  };

  const profile: Profile = {
    customer,
  };

  if (!customerRecord.accountId) {
    return profile;
  }

  accountRecord = await findAccountById(customerRecord.accountId);

  if (!accountRecord) {
    return null;
  }

  profile.rewards = {
    accountId: accountRecord.id,
    createdAt: accountRecord.createdAt,
    balance: accountRecord.balance,
    perks: accountRecord.perks,
  };

  return profile;
};

// Retrieve profile

profilesRouter.get(
  "/:customerId",
  async (request: Request<{ customerId: string }>, response: Response) => {
    const { customerId } = request.params;

    const profile = await getProfile(customerId);

    if (profile) {
      response.status(200).json(profile);
      return;
    }

    response.status(404).json({ message: "Profile not found." });
  }
);

// Create profile

profilesRouter.post(
  "/",
  async (request: Request<{}, {}, NewCustomerPayload>, response: Response) => {
    const newCustomerData = request.body;
    const customerId = newCustomerData.id;
    const existingCustomer = customersCollection
      .find({ id: customerId })
      .value();

    if (existingCustomer) {
      response.status(500).json({ message: "Unable to create profile." });
      return;
    }

    const customer = await createCustomer(newCustomerData);
    const account = await createAccount(customer.id);

    customersCollection
      .find({ id: customerId })
      .assign({ accountId: account.id })
      .write();

    const profile = await getProfile(customerId);

    response.status(200).json(profile);
  }
);

profilesRouter.put(
  "/",
  async (
    request: Request<{}, {}, UpdateCustomerPayload>,
    response: Response
  ) => {
    const customerUpdateData = request.body;
    const { id: customerId, name, email } = customerUpdateData;

    const existingCustomer = customersCollection
      .find({ id: customerId })
      .value();

    if (!existingCustomer) {
      response.status(500).json({ message: "Unable to update profile." });
      return;
    }

    customersCollection
      .find({ id: customerId })
      .assign({ name, email })
      .write();

    const profile = await getProfile(customerId);

    response.status(200).json(profile);
  }
);

module.exports = { profilesRouter };
