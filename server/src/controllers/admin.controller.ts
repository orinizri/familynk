// import { Request, Response, NextFunction } from "express";
// import * as adminService from "../services/admin.service.ts";
// import { sendSuccess, sendError } from "../utils/apiResponse.ts";

// /**
//  * Controller: Get all users (admin only)
//  *
//  * Handles GET /admin/users with support for search, role filtering,
//  * sorting by any field, and paginated results.
//  *
//  * @param {Request} req - Express request object
//  * @param {Response} res - Express response object
//  * @returns {JSON} - { users: [], total: number, page: number, pageSize: number }
//  */
// export async function getAllUsers(req: Request, res: Response, next: NextFunction) {
//   try {
//     const users = await adminService.getFilteredUsers(req.query);
//     sendSuccess(res, users);
//   } catch (error) {
//     console.error("getAllUsers error:", error);
//     sendError(res, "Failed to fetch users", 500);
//     next(error)
//   }
// }
