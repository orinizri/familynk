import { ASSIGNMENTS_PATH, CHARGES_PATH } from "../db/constants.js";

export const JSON_DB_PATHS = {
  charges: CHARGES_PATH,
  assignments: ASSIGNMENTS_PATH,
};

export const FILE_ENCODING = "utf-8";

export const RATE_LIMITER_MAX = 500; // Maximum number of requests per windowMs
export const RATE_LIMITER_WINDOW_MS = 15 * 60 * 1000; // 15 minutes in milliseconds
