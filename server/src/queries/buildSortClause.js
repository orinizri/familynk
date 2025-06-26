import {
  AdminUsersTableAllowedSorts as allowedSorts,
  AdminUsersTableAllowedOrders as allowedOrders,
} from "../constants/sorts.js";

/**
 * Safely constructs ORDER BY clause parts
 */
export function buildSortClause({ sortBy = "created_at", order = "DESC" }) {
  const safeSort = allowedSorts.includes(sortBy) ? sortBy : "created_at";
  const safeOrder = allowedOrders.includes(order.toUpperCase())
    ? order.toUpperCase()
    : "DESC";
  return { safeSort, safeOrder };
}
