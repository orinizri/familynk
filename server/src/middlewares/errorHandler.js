import AppError from "../utilities/appError.js";

/**
 * Error handling middleware for Express.
 * Catches thrown errors and sends uniform error responses.
 */
export function errorHandler(err, req, res, next) {
  // Log details (customize for production)
  console.error(`[${new Date().toISOString()}] ${err.stack || err.message}`);

  const statusCode = err instanceof AppError ? err.statusCode : 500;

  res.status(statusCode).json({
    success: false,
    error: err.message || "Internal Server Error",
    statusCode,
  });
}
