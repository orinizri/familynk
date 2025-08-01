/**
 * Middleware: validatePagination
 *
 * Ensures `req.query.cursor` and `req.query.limit` are valid integers
 * within the expected range, and replaces req.query with the parsed values.
 * On failure, forwards a 400 Bad Request via AppError.
 */

import { z } from "zod";
import AppError from "../utils/AppError";
import { RequestHandler } from "express";
import { PaginationType } from "@client/types/pagination.types";

// Zod schema for pagination parameters
const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(20),
  sortBy: z
    .enum(["id", "name", "created_at", "privacy", "updated_at"])
    .optional()
    .default("created_at"),
  order: z.enum(["asc", "desc"]).optional().default("desc"),
  startDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid start date",
    }),
  endDate: z
    .string()
    .optional()
    .refine((val) => !val || !isNaN(Date.parse(val)), {
      message: "Invalid end date",
    }),
});

/**
 * Express middleware to validate and normalize pagination query params.
 *
 * @param {Request}  req   – Express request (req.query may contain strings)
 * @param {Response} _res  – Express response (unused here)
 * @param {Function} next  – next middleware / error handler
 */
export const validatePagination: RequestHandler = (req, _res, next) => {
  console.log("validatePagination middleware called");
  const result = paginationSchema.safeParse(req.query);
  console.log("Pagination validation:", result);
  if (!result.success) {
    // Zod will give a descriptive error message
    return next(
      new AppError(
        `Invalid pagination parameters: ${result.error.message}`,
        400
      )
    );
  }
  // Write corrected pagination values back to req.query
  req.pagination = result.data as Partial<PaginationType>;
  next();
};
