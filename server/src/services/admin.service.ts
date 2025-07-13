import { build_filter_query } from "../db/utils/sqlFilterBuilder.ts";
import { build_pagination_clause } from "../db/utils/sqlPaginationBuilder.ts";
import { filterTableAllowedFields } from "../utils/constants.ts";
import pool from "../db/db.ts";
/**
 * Fetch users with dynamic filters, sorting, and pagination.
 *
 * @param {Object} filters - Optional filters: email, role, startDate, endDate
 * @param {Object} pagination - page (number), limit (number), sortBy (string), order ('ASC'|'DESC')
 * @returns {Promise<{ data: object[], meta: object }>} - Users and pagination metadata
 */
export async function getFilteredUsers(filters = {}, _pagination = {}) {
  const {
    page = 1,
    limit = 10,
    sortBy = "created_at",
    order = "DESC",
  } = filters;

  const { whereSql, values, nextIndex } = build_filter_query(
    filters,
    filterTableAllowedFields
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
