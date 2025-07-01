import rateLimit from "express-rate-limit";
import {
  RATE_LIMITER_MAX,
  RATE_LIMITER_WINDOW_MS,
} from "../utilities/constants.js";
/**
 * Global rate-limiting middleware.
 *
 * Limits each IP to a maximum of {RATE_LIMITER_MAX} requests per {RATE_LIMITER_WINDOW_MS} window.
 * If the limit is exceeded, responds with HTTP 429 and a JSON error.
 *
 * NOTE: In a clustered PM2 setup this in-memory store will be per-process,
 *       so the true limit = max × number_of_workers.
 *       For a single global limit across all workers, swap in a Redis store.
 */
export const limiter = rateLimit({
  // 15 minutes in milliseconds
  windowMs: RATE_LIMITER_WINDOW_MS,
  // max requests per window per IP
  max: RATE_LIMITER_MAX,
  // standard RateLimit-* headers (RateLimit-Limit, RateLimit-Remaining, RateLimit-Reset)
  standardHeaders: true,
  // disable the older X-RateLimit-* headers
  legacyHeaders: false,

  handler: (_req, res) => {
    res.status(429).json({
      error: "Too many requests from this IP, please try again later.",
    });
  },
});
