import { sendError } from "../utils/apiResponse";
import AppError from "../utils/AppError";
import { isAppError } from "../utils/isAppError";
import { logger } from "../utils/logger";
import { Request, Response, ErrorRequestHandler } from "express";

export const errorMiddleware: ErrorRequestHandler = (
  err,
  _req: Request,
  res: Response
) => {
  logger.error(err);
  const isErrAppError: boolean = isAppError(err);
  let status = 500;
  let message = "Internal Server Error";
  if (isErrAppError) {
    // If the error is an instance of AppError, use its properties
    const appError = err as AppError;
    status = appError.statusCode;
    message = appError.message;
  }

  sendError(res, message, status);
};
