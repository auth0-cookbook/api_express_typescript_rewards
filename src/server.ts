import express, { Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import * as dotenv from "dotenv";
import { HttpException } from "./exceptions/http-exception";
import { errorMiddleware } from "./exceptions/error-middleware";

const { accountsRouter } = require("./accounts/accounts.router");

dotenv.config();

if (!process.env.PORT) {
  throw new Error("You need to define environment variable PORT in .env");
}

const PORT: number = parseInt(process.env.PORT, 10);

const app = express();
const rewardsApiRouter = express.Router();

app.use(cors());
app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", rewardsApiRouter);
rewardsApiRouter.use("/rewards/accounts", accountsRouter);

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
