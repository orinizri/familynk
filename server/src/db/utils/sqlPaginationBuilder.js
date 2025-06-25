export function build_pagination_clause(
  page,
  limit,
  sortBy,
  order,
  paramIndexStart = 1
) {
  const safeSortBy = ["id", "email", "created_at", "role"].includes(sortBy)
    ? sortBy
    : "created_at";
  const safeOrder = order?.toUpperCase() === "ASC" ? "ASC" : "DESC";

  const offset = (page - 1) * limit;
  return {
    paginationSql: `ORDER BY ${safeSortBy} ${safeOrder} LIMIT $${paramIndexStart} OFFSET $${
      paramIndexStart + 1
    }`,
    paginationValues: [limit, offset],
  };
}
