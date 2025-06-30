import { fetchReservations } from "../services/reservationService.js";

/**
 * GET /reservations?cursor=<lastId>&limit=<n>
 * Returns { reservations: [...], nextCursor: <id|null> }
 */
export const getReservationsController = async (req, res, next) => {
  try {
    // 1. Parse & clamp pagination params
    const cursor = parseInt(req.query.cursor, 10) || 0;
    const limit = Math.min(
      Math.max(parseInt(req.query.limit, 10) || 20, 1),
      100
    );

    // 2. Delegate to service layer
    const { reservations, nextCursor } = await fetchReservations({
      cursor,
      limit,
    });

    // 3. Send JSON response
    return res.json({ reservations, nextCursor });
  } catch (err) {
    return next(err);
  }
};
