export const filterTableAllowedFields = [
  "email",
  "role",
  "created_at",
  "startDate",
  "endDate",
];
export const AdminUsersTableAllowedSorts = ["email", "created_at", "role"];
export const AdminUsersTableAllowedOrders = ["ASC", "DESC"];

// constants.js
export const RATE_LIMITER_WINDOW_MS = 15 * 60 * 1000; // 15 minutes
export const RATE_LIMITER_MAX = 100; // 100 requests per IP per 15 minutes
export const FILE_ENCODING = "utf-8";