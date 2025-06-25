export function buildUserDataQuery({
  whereClause,
  sortBy,
  order,
  valuesLength,
}) {
  return `
      SELECT id, email, first_name, last_name, role, created_at
      FROM users
      ${whereClause}
      ORDER BY ${sortBy} ${order}
      LIMIT $${valuesLength + 1} OFFSET $${valuesLength + 2};
    `;
}

export function buildUserCountQuery(whereClause) {
  return `
      SELECT COUNT(*) AS total
      FROM users
      ${whereClause};
    `;
}
