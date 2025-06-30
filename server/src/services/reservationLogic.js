import { parseNumber } from "../utilities/numberUtils.js";

/**
 * @typedef Assignment
 * @property {number} id
 * @property {string} reservation_uuid
 * @property {string} name
 *
 * @typedef Charge
 * @property {number} special_product_assignment_id
 * @property {boolean} active
 * @property {number} amount
 *
 * @typedef Product
 * @property {number} id
 * @property {string} name
 * @property {"active"|"cancelled"|"offeredOnly"} status
 * @property {number|null} charge
 *
 * @typedef Reservation
 * @property {string} reservationUuid
 * @property {Product[]} products
 * @property {number} activePurchasesSum
 * @property {number} activeChargesSum
 */

/**
 * Groups flat assignments + charges into reservation objects.
 *
 * @param {Assignment[]} assignments
 * @param {Charge[]}     charges
 * @returns {Reservation[]}
 */
export function processReservations(assignments, charges) {
  // 1. Build a map of productId → product
  const productsMap = new Map();
  for (const { id, reservation_uuid, name } of assignments) {
    productsMap.set(id, {
      id,
      name,
      status: "offeredOnly",
      charge: null,
      reservationUuid: reservation_uuid,
    });
  }

  // 2. Apply charge data
  for (const {
    special_product_assignment_id: productId,
    active,
    amount,
  } of charges) {
    const product = productsMap.get(productId);
    if (!product) continue;
    if (active) {
      product.status = "active";
      product.charge = parseNumber(amount);
    } else {
      product.status = "cancelled";
    }
  }

  // 3. Group by reservationUuid
  const reservationsMap = new Map();
  for (const product of productsMap.values()) {
    const { reservationUuid, status } = product;
    if (!reservationsMap.has(reservationUuid)) {
      reservationsMap.set(reservationUuid, {
        reservationUuid,
        products: [],
        activePurchasesSum: 0,
        activeChargesSum: 0,
      });
    }
    const reservation = reservationsMap.get(reservationUuid);
    reservation.products.push({
      id: product.id,
      name: product.name,
      status: product.status,
      charge: product.charge,
    });
    if (status === "active") {
      reservation.activePurchasesSum += 1;
      reservation.activeChargesSum += product.charge;
    }
  }

  // 4. Return array of reservations
  return Array.from(reservationsMap.values());
}
