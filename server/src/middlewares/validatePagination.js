/**
 * Middleware: validatePagination
 *
 * Ensures `req.query.cursor` and `req.query.limit` are valid integers
 * within the expected range, and replaces req.query with the parsed values.
 * On failure, forwards a 400 Bad Request via AppError.
 */

import { z } from "zod";
import AppError from "../utilities/appError.js";

// Zod schema for pagination parameters
const paginationSchema = z.object({
  cursor: z.coerce.string().optional(), // cursor is optional
  limit: z.coerce
    .number()
    .int()
    .min(1) // Greater than 1
    .max(100) // Less than 100
    .default(20), // default page size
});

/**
 * Express middleware to validate and normalize pagination query params.
 *
 * @param {Request}  req   – Express request (req.query may contain strings)
 * @param {Response} _res  – Express response (unused here)
 * @param {Function} next  – next middleware / error handler
 */
export function validatePagination(req, _res, next) {
  const result = paginationSchema.safeParse(req.query);
  console.log("result", result);
  if (!result.success) {
    // Zod will give a descriptive error message
    return next(
      new AppError(
        `Invalid pagination parameters: ${result.error.message}`,
        400
      )
    );
  }
  console.log(`Valid pagination parameters: ${JSON.stringify(result.data)}`);
  // Write corrected pagination values back to req.query
  req.pagination = result.data;
  next();
}
