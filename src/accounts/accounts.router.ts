import express, { Request, Response } from "express";
import {
  findAccountById,
  createAccount,
  findAllAccounts,
} from "./accounts.service";

const { checkJwt } = require("../authz/check-jwt");

const accountsRouter = express.Router();

accountsRouter.use(checkJwt);

// GET /api/accounts

accountsRouter.get("/", async (request: Request, response: Response) => {
  const accountRecord = await findAllAccounts();

  if (accountRecord === undefined) {
    response.sendStatus(404);
    return;
  }

  response.json(accountRecord);
});

// GET /api/accounts/:id

accountsRouter.get(
  "/:id",
  async (request: Request<{ id: string }>, response: Response) => {
    const id = parseInt(request.params.id, 10);

    const accountRecord = await findAccountById(id);

    if (accountRecord === undefined) {
      response.sendStatus(404);
      return;
    }

    response.json(accountRecord);
  }
);

// POST /api/accounts/

accountsRouter.post(
  "/",
  async (
    request: Request<{}, {}, { customerId: string }>,
    response: Response
  ) => {
    const { customerId } = request.body;

    await createAccount(parseInt(customerId, 10));

    response.sendStatus(200);
  }
);

module.exports = { accountsRouter };
