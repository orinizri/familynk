import fs from "fs";
import { sendSuccess, sendError } from "../utilities/apiResponse.js";
import AppError from "../utilities/appError.js";
import { loadAssignments, loadCharges } from "../db/loaders.js";
import { processReservations } from "../services/reservationService.js";

// Controller to fetch reservations with their products and charges
// [{
//   "reservationUuid": 123,
//   "products" : [{
//     "id" : 123,
//     "name": "Dinner",
//     "charge": 20,
//     "status": "active"
//   }],
//   "active_purchases_sum": 2,
//   "active_charges_sum": 60
// }]
/**
 * Fetches reservations with their products and charges.
 * @param {Object} _req - The request object (not used).
 * @param {Object} res - The response object.
 * @return {Promise<void>} - Sends a response with the reservations data or an error.
 * */

export const getReservationsController = async (_req, res) => {
  let productAssignments, charges;
  try {
    try {
      // Load product assignments and charges from the database
      productAssignments = await loadAssignments();
      charges = await loadCharges();
      // Check if the data was loaded successfully
      if (!productAssignments || !charges) {
        throw new AppError("Failed to load assignments or charges", 500);
      }
    } catch (error) {
      console.error("Data loading error:", err);
      throw new AppError("Failed to load required data", 500);
    }

    const reservations = processReservations(productAssignments, charges);

    return sendSuccess(res, reservations);
  } catch (error) {
    console.error("Unhandled error in getReservationsController:", error);
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    return sendError(res, error.message || "Internal Server Error", statusCode);
  }
};
