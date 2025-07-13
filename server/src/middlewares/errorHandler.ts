import { Request, Response, NextFunction } from "express";
import { isAppError } from "../utils/isAppError.ts";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction
) {
  if (isAppError(err)) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV !== "production" && {
        stack: err.stack,
      }),
    });
  } else {
    res.status(500).json({
      success: false,
      message: "Internal Server Error",
      ...(process.env.NODE_ENV !== "production" && {
        error: String(err),
      }),
    });
  }
}
