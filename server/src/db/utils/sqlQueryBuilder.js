export function build_filter_query(filters, allowedFields, startIndex = 1) {
  const whereClauses = [];
  const values = [];
  let index = startIndex;

  for (const [key, value] of Object.entries(filters)) {
    if (!allowedFields.includes(key) || value == null) continue;

    if (typeof value === "string") {
      whereClauses.push(`${key} ILIKE $${index}`);
      values.push(`%${value}%`);
    } else {
      whereClauses.push(`${key} = $${index}`);
      values.push(value);
    }

    index++;
  }

  return {
    whereSql: whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "",
    values,
    nextIndex: index,
  };
}

export function build_pagination_clause(
  page = 1,
  limit = 10,
  sortBy = "created_at",
  order = "DESC",
  startIndex = 1
) {
  const offset = (page - 1) * limit;
  const paginationSql = `ORDER BY ${sortBy} ${order} LIMIT $${startIndex} OFFSET $${
    startIndex + 1
  }`;
  const paginationValues = [limit, offset];

  return { paginationSql, paginationValues };
}
