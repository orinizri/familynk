// import { Filters } from "@server/services/admin.service";

// export function build_filter_query(
//   filters: Filters,
//   allowedFields: string[],
//   startingIndex = 1
// ) {
//   const whereClauses = [];
//   const values = [];
//   let i = startingIndex;

//   for (const key in filters) {
//     if (!allowedFields.includes(key) || !filters[key as keyof Filters])
//       continue;

//     if (key === "email") {
//       whereClauses.push(`email ILIKE $${i++}`);
//       values.push(`%${filters[key]}%`);
//     } else if (key === "startDate") {
//       whereClauses.push(`created_at >= $${i++}`);
//       values.push(new Date(filters[key] as string).toISOString());
//     } else if (key === "endDate") {
//       whereClauses.push(`created_at <= $${i++}`);
//       values.push(new Date(filters[key] as string).toISOString());
//     } else {
//       whereClauses.push(`${key} = $${i++}`);
//       values.push(filters[key as keyof Filters] as string);
//     }
//   }

//   return {
//     whereSql: whereClauses.length ? `WHERE ${whereClauses.join(" AND ")}` : "",
//     values,
//     nextIndex: i,
//   };
// }
