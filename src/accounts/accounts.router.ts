import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import { findCustomerById } from "../customers/customers.service";
import {
  adjustBalance,
  createAccount,
  findAccountByCustomerId,
} from "./accounts.service";

dotenv.config();

const accountsRouter = express.Router();

accountsRouter.use(auth());

// Create rewards account

accountsRouter.post(
  "/",
  async (
    request: Request<{}, {}, { customerId: string }>,
    response: Response
  ) => {
    const customerId = request.body.customerId;
    const customer = await findCustomerById(customerId);

    if (!customer) {
      response.sendStatus(500);
      return;
    }

    const newAccount = await createAccount(customerId);

    response.json(newAccount);
  }
);

// Retrieve rewards account using customerId

accountsRouter.get(
  "/:customerId",
  async (request: Request<{ customerId: string }>, response: Response) => {
    const customerId = request.params.customerId;

    const accountRecord = await findAccountByCustomerId(customerId);

    if (accountRecord) {
      response.json(accountRecord);
      return;
    }

    response.sendStatus(404);
  }
);

// Accumulate reward points

accountsRouter.post(
  "/:id/adjust",
  async (
    request: Request<{ id: string }, {}, { points: number }>,
    response: Response
  ) => {
    const id = request.params.id;
    const points = request.body.points;

    const newBalance = await adjustBalance(id, points);

    if (newBalance) {
      response.sendStatus(200);
      return;
    }

    response.sendStatus(404);
  }
);

module.exports = { accountsRouter };
