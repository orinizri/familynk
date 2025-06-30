// src/services/reservationService.js
import { getAssignments, getChargesByAssignmentIds } from "../db/helpers.js";
import { processReservations } from "./reservationLogic.js";

/**
 * Fetches a page of reservations using cursor-based pagination.
 * @param {{cursor?:number,limit?:number}} opts
 * @returns {Promise<{reservations:object[], nextCursor:number|null}>}
 */
export async function fetchReservations({ cursor = 0, limit = 20 } = {}) {
  // 1. Fetch assignments page
  const assignments = await getAssignments(cursor, limit);

  // 2. Early exit if none
  if (assignments.length === 0) {
    return { reservations: [], nextCursor: null };
  }

  // 3. Fetch only relevant charges
  const ids = assignments.map((a) => a.id);
  const charges = await getChargesByAssignmentIds(ids);

  // 4. Group them
  const reservations = processReservations(assignments, charges);

  // 5. Compute nextCursor
  const nextCursor = assignments[assignments.length - 1].id;

  return { reservations, nextCursor };
}
