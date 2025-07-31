import { sendError } from "@server/utils/apiResponse";
import AppError from "@server/utils/AppError";
import { isAppError } from "@server/utils/isAppError";
import { logger } from "@server/utils/logger";
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
