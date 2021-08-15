import cors from "cors";
import * as dotenv from "dotenv";
import express, { Request, Response } from "express";
import helmet from "helmet";
import { errorMiddleware } from "./exceptions/error-middleware";
import { HttpException } from "./exceptions/http-exception";

const { accountsRouter } = require("./accounts/accounts.router");
const { customersRouter } = require("./customers/customers.router");
const { profilesRouter } = require("./profiles/profiles.router");

dotenv.config();

if (!process.env.PORT) {
  throw new Error("You need to define environment variable PORT in .env");
}

const PORT: number = parseInt(process.env.PORT, 10);

const app = express();
const apiRouter = express.Router();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", apiRouter);
apiRouter.use("/accounts", accountsRouter);
apiRouter.use("/customers", customersRouter);
apiRouter.use("/profiles", profilesRouter);

app.get("*", (req: Request, res: Response) => {
  const undefinedResourceError: HttpException = {
    name: "Unknown resource",
    status: 404,
    message:
      "the resource you requested in not defined, please check your request URL",
  };
  res.status(undefinedResourceError.status).json(undefinedResourceError);
});

app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Rewards API serving resources on PORT:${PORT}`);
});
