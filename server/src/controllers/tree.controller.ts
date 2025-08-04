/**
 * src/controllers/reservationController.js
 *
 * HTTP controller: parses query, calls service, returns JSON.
 */

import { Request, Response, NextFunction } from "express";
import { createTree, fetchTrees } from "../services/tree.service";
import { Tree } from "../types/tree.types";
import { sendSuccess } from "../utils/apiResponse";

/**
 * GET /trees?cursor=&limit=
 */
export const getTreesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log("getTreesController called with pagination:", req.pagination);
  try {
    // Passing cursor and limit from req.body.pagination (validated by middleware)
    const userIdFromToken = req.user.id;
    const response = await fetchTrees({
      filters: req.pagination,
      user_id: userIdFromToken,
    });
    sendSuccess(res, response);
  } catch (err) {
    console.error("Error in getTreesController:", err);
    next(err);
  }
};

/**
 * POST /trees
 * Handles the creation of a new tree.
 * It expects the request body to contain the tree name, user_id and privacy.
 * and calls the service to create the tree.
 */
export const createTreesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Passing cursor and limit from req.body.pagination (validated by middleware)
    const options = req.body as Tree;
    const userIdFromToken = req.user.id;
    const tree = await createTree({ ...options, user_id: userIdFromToken });
    sendSuccess(res, { tree });
  } catch (err) {
    console.error("Error in createTreesController:", err);
    next(err);
  }
};
