export function build_filter_query(filters, allowedFields, startingIndex = 1) {
  const whereClauses = [];
  const values = [];
  let i = startingIndex;

  for (const key in filters) {
    if (!allowedFields.includes(key) || !filters[key]) continue;

    if (key === "email") {
      whereClauses.push(`email ILIKE $${i++}`);
      values.push(`%${filters[key]}%`);
    } else if (key === "startDate") {
      whereClauses.push(`created_at >= $${i++}`);
      values.push(new Date(filters[key]).toISOString());
    } else if (key === "endDate") {
      whereClauses.push(`created_at <= $${i++}`);
      values.push(new Date(filters[key]).toISOString());
    } else {
      whereClauses.push(`${key} = $${i++}`);
      values.push(filters[key]);
    }
  }

  return {
    whereSql: whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "",
    values,
    nextIndex: i,
  };
}
