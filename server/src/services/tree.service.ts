/**
 * Fetches a page of trees.
 * @param {{ cursor?: number, limit?: number }} opts
 * @returns {{ reservations: object[], nextCursor: number|null }}
 */

import pool from "../db/db";
import {
  FetchTreesOptions,
  FetchTreesResponse,
  Tree,
} from "../types/tree.types";
import AppError from "../utils/AppError";

export async function fetchTrees({
  cursor,
  limit = 20,
}: FetchTreesOptions = {}): Promise<FetchTreesResponse> {
  try {
    const result = await pool.query(`SELECT * from trees WHERE user_id = $1`, [
      cursor,
    ]);

    if (!result.rows.length) {
      throw new AppError("Get Trees Failed", 404);
    }
    const page = result.rows as Tree[];
    // Cursor is the UUID of the last reservation in the page,
    const nextCursor = page.length < limit ? null : page[page.length - 1].id;
    return {
      trees: page,
      nextCursor,
    };
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in getProfileService:", error);
      throw new AppError("Failed to fetch profile", 500);
    }
    throw error;
  }
}
export async function createTree({
  name,
  user_id,
  privacy,
}: {
  name: string;
  user_id: string;
  privacy: "public" | "private";
}): Promise<Tree> {
  try {
    const result = await pool.query(
      `INSERT INTO trees (name, user_id, privacy)
       VALUES ($1, $2, $3)
       RETURNING id`,
      [name, user_id, privacy]
    );

    const tree = result.rows[0] as Tree;

    if (!tree) {
      throw new AppError("Create Tree Failed", 404);
    }

    return tree;
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in getProfileService:", error);
      throw new AppError("Failed to fetch profile", 500);
    }
    throw error;
  }
}
