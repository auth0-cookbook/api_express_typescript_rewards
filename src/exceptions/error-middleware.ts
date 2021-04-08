import { HttpException } from "./http-exception";
import { NextFunction, Request, Response } from "express";

export const errorMiddleware = (
  err: HttpException,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const status = err.status || 500;
  const message = err.message || "server error";

  console.error(err.stack);

  res.status(status).send({ status, message });
};
