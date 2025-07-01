/**
 * src/controllers/reservationController.js
 *
 * HTTP controller: parses query, calls service, returns JSON.
 */

import { fetchReservations } from "../services/reservationService.js";

/**
 * GET /reservations?cursor=&limit=
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export function getReservationsController(req, res, next) {
  try {
    // Passing cursor and limit from req.pagination (validated by middleware)
    const { reservations, nextCursor } = fetchReservations(req.pagination);
    res.json({ reservations, nextCursor });
  } catch (err) {
    next(err);
  }
}
