import * as userService from "../services/user.service.js";
import { sendSuccess, sendError } from "../utils/apiResponse.js";

/**
 * Controller: Get all users (admin only)
 *
 * Handles GET /admin/users with support for search, role filtering,
 * sorting by any field, and paginated results.
 *
 * @param {Request} req - Express request object
 * @param {Response} res - Express response object
 * @returns {JSON} - { users: [], total: number, page: number, pageSize: number }
 */
export async function getAllUsers(req, res, next) {
  try {
    const users = await userService.getFilteredUsers(req.query);
    return sendSuccess(res, users);
  } catch (error) {
    console.error("getAllUsers error:", error);
    return sendError(error, "Failed to fetch users", 500);
  }
}
