import pool from "../db/db.js";
import { buildPaginationClause } from "../queries/buildPagination.js";
import { buildSortClause } from "../queries/buildSortClause.js";
import {
  buildUserDataQuery,
  buildUserCountQuery,
} from "../queries/buildUserDataAndCountQueries.js";

/**
 * Fetch paginated, filtered, sorted list of users with metadata
 */
export async function fetchUsers(filters, pagination) {
  const { offset, limit } = buildPaginationClause(pagination);
  const { safeSort, safeOrder } = buildSortClause(pagination);
  const whereClause = build_filter_query(filters, ["email", "role", "created_at"]);
  const paginationClause = build_pagination_clause(page, limit, sortBy, order, nextIndex);
  
  const dataQuery = buildUserDataQuery({
    whereClause,
    sortBy: safeSort,
    order: safeOrder,
    valuesLength: values.length,
  });

  const countQuery = buildUserCountQuery(whereClause);
  const dataValues = [...values, limit, offset];

  const [dataRes, countRes] = await Promise.all([
    pool.query(dataQuery, dataValues),
    pool.query(countQuery, values),
  ]);

  return {
    data: dataRes.rows,
    meta: {
      total: parseInt(countRes.rows[0].total, 10),
      page: pagination.page,
      limit,
      pageCount: Math.ceil(countRes.rows[0].total / limit),
    },
  };
}
