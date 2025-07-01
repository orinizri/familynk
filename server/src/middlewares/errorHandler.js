import { NODE_ENV } from "../config/env.js";
/**
 * Catches all errors passed via next(err) and
 * formats a consistent JSON response.
 */
export default function errorHandler(err, req, res, next) {
  console.error("Error caught by errorHandler:", err);
  // If this is our custom AppError, use its statusCode; otherwise 500
  const status = err.statusCode || 500;
  const payload = {
    message: err.message || "Internal Server Error",
  };

  // In dev, attach the stack trace for easier debugging
  if (NODE_ENV !== "production") {
    payload.stack = err.stack;
  }

  // Log the error (you can replace this with pino/winston)
  console.error(`[${req.method} ${req.originalUrl}]`, err);

  // Send JSON error response
  res.status(status).json({ error: payload });
}
