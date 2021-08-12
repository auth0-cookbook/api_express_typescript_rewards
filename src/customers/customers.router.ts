import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import { auth } from "express-oauth2-jwt-bearer";
import {
  createCustomer,
  findAllCustomers,
  findCustomerById,
} from "../customers/customers.service";
import { customersCollection } from "../database/database.service";
import { NewCustomerPayload } from "src/models/payloads/new-customer-payload";
import { UpdateCustomerPayload } from "src/models/payloads/update-customer-payload";

dotenv.config();

const customersRouter = express.Router();

customersRouter.use(auth());

// List customers

customersRouter.get("/", async (request: Request, response: Response) => {
  const customers = await findAllCustomers();

  if (customers) {
    response.json(customers);
    return;
  }

  response.sendStatus(404);
});

// Retrieve customer

customersRouter.get(
  "/:id",
  async (request: Request<{ id: string }>, response: Response) => {
    const id = request.params.id;

    const customer = await findCustomerById(id);

    if (customer) {
      response.json(customer);
      return;
    }

    response.sendStatus(404);
  }
);

// Create customer

customersRouter.post(
  "/",
  async (request: Request<{}, {}, NewCustomerPayload>, response: Response) => {
    const newCustomer = request.body;
    const id = newCustomer.id;
    const existingCustomer = customersCollection.find({ id }).value();

    if (existingCustomer) {
      response.sendStatus(500);
      return;
    }

    await createCustomer(newCustomer);

    response.json(newCustomer);
  }
);

// Update customer

customersRouter.put(
  "/",
  async (
    request: Request<{}, {}, UpdateCustomerPayload>,
    response: Response
  ) => {
    const customerUpdate = request.body;
    const id = customerUpdate.id;
    const existingCustomer = customersCollection.find({ id }).value();

    if (!existingCustomer) {
      response.sendStatus(404);
      return;
    }

    customersCollection
      .find({ id })
      .assign({ name: customerUpdate.name })
      .write();

    const updatedCustomer = customersCollection.find({ id }).value();

    response.json(updatedCustomer);
  }
);

module.exports = { customersRouter };
