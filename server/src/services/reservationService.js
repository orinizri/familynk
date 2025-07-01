import { getReservationsAfter } from "../db/jsonCache.js";

/**
 * Fetches a page of reservations.
 * @param {{ cursor?: number, limit?: number }} opts
 * @returns {{ reservations: object[], nextCursor: number|null }}
 */
export function fetchReservations({ cursor, limit = 20 } = {}) {
  // Compute the slice of reservations starting after the cursor
  const page = getReservationsAfter(cursor, limit);
  // Cursor is the UUID of the last reservation in the page,
  const nextCursor =
    page.length < limit ? null : page[page.length - 1].reservationUuid;
  return {
    reservations: page,
    nextCursor,
  };
}
