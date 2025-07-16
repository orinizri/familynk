/**
 * src/controllers/reservationController.js
 *
 * HTTP controller: parses query, calls service, returns JSON.
 */

import { Request, Response, NextFunction } from "express";
import { createTree, fetchTrees } from "../services/tree.service.ts";
import { FetchTreesOptions, Tree } from "../types/tree.types.ts";
import { sendSuccess } from "../utils/apiResponse.ts";

/**
 * GET /trees?cursor=&limit=
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
 */
export const getTreesController = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    // Passing cursor and limit from req.body.pagination (validated by middleware)
    const options = req.body as FetchTreesOptions;
    const { trees, nextCursor } = await fetchTrees(options);
    sendSuccess(res, { trees, nextCursor });
  } catch (err) {
    next(err);
  }
};


/**
 * POST /trees
 *
 * @param {Request} req
 * @param {Response} res
 * @param {Function} next
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
    const tree = await createTree(options);
    sendSuccess(res, { tree });
  } catch (err) {
    next(err);
  }
};
