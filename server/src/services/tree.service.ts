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
  user_id,
  filters,
}: FetchTreesOptions): Promise<FetchTreesResponse> {
  console.log("filters", filters);
  const { page, limit, sortBy, order, startDate, endDate, name } = filters;

  const offset = (page - 1) * limit;

  const values: string[] = [user_id];
  let idx = 2; // Start from 2 because $1 is user_id
  let whereClause = `WHERE user_id = $1`;

  if (startDate) {
    whereClause += ` AND created_at >= $${idx++}`;
    values.push(startDate);
  }
  if (endDate) {
    whereClause += ` AND created_at <= $${idx++}`;
    values.push(endDate);
  }
  if (name) {
    whereClause += ` AND name ILIKE $${idx++}`;
    values.push(`%${name}%`);
  }

  const orderByClause = `ORDER BY ${sortBy} ${order.toUpperCase()}`;
  const limitOffsetClause = `LIMIT $${idx++} OFFSET $${idx++}`;
  values.push(limit.toString(), offset.toString());

  const query = `
    SELECT * FROM trees
    ${whereClause}
    ${orderByClause}
    ${limitOffsetClause}
  `;
  console.log("query", query);
  const countQuery = `
    SELECT COUNT(*) FROM trees
    ${whereClause}
  `;
  try {
    const [result, countResult] = await Promise.all([
      pool.query(query, values),
      pool.query(countQuery, values.slice(0, idx - 3)), // Only the WHERE params
    ]);

    const trees = result.rows as Tree[];
    const countRow = countResult.rows[0] as { count: string };
    const totalCount = parseInt(countRow.count, 10);

    return {
      data: trees,
      meta: { pageCount: totalCount ? Math.ceil(totalCount / limit) : 0 },
    };
  } catch (error) {
    console.error("Failed to fetch trees:", error);
    throw new AppError("Failed to fetch trees", 500);
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
