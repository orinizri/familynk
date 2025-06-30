import pool from "./pool.js";

/**
 * Fetch a page of product assignments using keyset pagination.
 * @param {number} cursor ‒ last seen assignment.id (0 for first page)
 * @param {number} limit  ‒ maximum rows to fetch
 * @returns {Promise<Array<{id:number,reservation_uuid:string,name:string}>>}
 */
export async function getAssignments(cursor = 0, limit = 20) {
  const { rows } = await pool.query(
    `
      SELECT id, reservation_uuid, name
      FROM product_assignments
      WHERE id > $1
      ORDER BY id
      LIMIT $2
    `,
    [cursor, limit]
  );
  return rows;
}

/**
 * Fetch all charges for a given set of assignment IDs.
 * @param {number[]} assignmentIds
 * @returns {Promise<Array<{special_product_assignment_id:number,active:boolean,amount:number}>>}
 */
export async function getChargesByAssignmentIds(assignmentIds = []) {
  if (!assignmentIds.length) return [];
  const { rows } = await pool.query(
    `
      SELECT special_product_assignment_id, active, amount
      FROM product_charges
      WHERE special_product_assignment_id = ANY($1)
    `,
    [assignmentIds]
  );
  return rows;
}
