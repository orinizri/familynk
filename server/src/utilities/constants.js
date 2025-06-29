import { ASSIGNMENTS_PATH, CHARGES_PATH } from "../db/constants.js";

export const JSON_DB_PATHS = {
  charges: CHARGES_PATH,
  assignments: ASSIGNMENTS_PATH,
};

export const STREAM_THRESHOLD_BYTES = 5 * 1024 * 1024; // 5MB
export const FILE_ENCODING = "utf-8";
