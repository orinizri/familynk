import pool from "../db/db.js";
import AppError from "../utils/appError.js";
import { build_filter_query } from "../db/utils/sqlFilterBuilder.js";
import { build_pagination_clause } from "../db/utils/sqlPaginationBuilder.js";

export async function getProfile(userId) {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, date_of_birth, photo_url, created_at, last_login, role
       FROM users WHERE id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      throw new AppError("User not found", 404);
    }

    return result.rows[0];
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in getProfileService:", error);
      throw new AppError("Failed to fetch profile", 500);
    }
    throw error;
  }
}

// PATCH /me
export async function updateProfile(userId, body) {
  const { first_name, last_name, date_of_birth, photo_url } = body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, date_of_birth = $3, photo_url = $4
       WHERE id = $5
       RETURNING id, email, first_name, last_name, date_of_birth, photo_url`,
      [first_name, last_name, date_of_birth, photo_url, userId]
    );

    if (!result.rows.length) {
      throw new AppError("Failed to update profile", 404);
    }

    return result.rows[0];
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in updateProfileService:", error);
      throw new AppError("Failed to update profile", 500);
    }
    throw error;
  }
}

export async function deleteProfile(userId) {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);

    // Optional: Check rowCount to confirm deletion
    if (result.rowCount === 0) {
      throw new AppError("User not found", 404);
    }
    return;
  } catch (err) {
    if (!(err instanceof AppError)) {
      console.error("Unexpected error in deleteProfileService:", err);
      throw new AppError("Failed to delete account", 500);
    }
    throw err;
  }
}

/**
 * Fetch users with dynamic filters, sorting, and pagination.
 *
 * @param {Object} filters - Optional filters: email, role, startDate, endDate
 * @param {Object} pagination - page (number), limit (number), sortBy (string), order ('ASC'|'DESC')
 * @returns {Promise<{ data: object[], meta: object }>} - Users and pagination metadata
 */
export async function fetchUsers(filters, pagination) {
  const {
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "DESC",
  } = pagination;

  const allowedFields = ["email", "role", "created_at"];
  const { whereSql, values, nextIndex } = build_filter_query(
    filters,
    allowedFields
  );
  const { paginationSql, paginationValues } = build_pagination_clause(
    page,
    limit,
    sortBy,
    order,
    nextIndex
  );

  const dataQuery = `
    SELECT id, email, first_name, last_name, role, created_at
    FROM users
    ${whereSql}
    ${paginationSql};
  `;

  const countQuery = `
    SELECT COUNT(*) AS total
    FROM users
    ${whereSql};
  `;
  console.log("Data Query:", dataQuery);
  console.log("Count Query:", countQuery);
  const dataValues = [...values, ...paginationValues];
  const countValues = [...values];

  const [dataRes, countRes] = await Promise.all([
    pool.query(dataQuery, dataValues),
    pool.query(countQuery, countValues),
  ]);

  const total = parseInt(countRes.rows[0].total, 10);

  return {
    data: dataRes.rows,
    meta: {
      total,
      page,
      limit,
      pageCount: Math.ceil(total / limit),
    },
  };
}
