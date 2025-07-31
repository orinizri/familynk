import { Request, Response } from "express";
import { isAppError } from "../utils/isAppError";

export default function errorHandler(
  err: unknown,
  _req: Request,
  res: Response
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
        error: JSON.stringify(err),
      }),
    });
  }
}
