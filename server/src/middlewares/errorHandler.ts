import { ErrorRequestHandler } from "express";
import { isAppError } from "../utils/isAppError";
import { ZodError } from "zod";

const errorHandler: ErrorRequestHandler = (
  err,
  _req,
  res,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  _next
) => {
  if (res.headersSent) {
    return;
  }
  if (err instanceof ZodError) {
    res.status(400).json({
      success: false,
      message: "Validation Error",
      errors: err.flatten().fieldErrors, // ✅ Friendly shape
    });
    return;
  }
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
};

export default errorHandler;
