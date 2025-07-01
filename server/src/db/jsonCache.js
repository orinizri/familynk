/**
 * src/db/jsonCache.js
 *
 * In-memory cache of reservation objects, built once from static JSON.
 * Each reservation has:
 *   - reservationUuid: string
 *   - products: Array<{ id, name, status, charge }>
 *   - activePurchasesSum: number
 *   - activeChargesSum: number
 */

import path from "path";
import { fileURLToPath } from "url";
import { readJson } from "../utilities/jsonLoader.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Adjust paths to your JSON files:
const ASSIGNMENTS_PATH = path.resolve(
  __dirname,
  "../../data/product_assignment.json"
);
const CHARGES_PATH = path.resolve(__dirname, "../../data/product_charges.json");

let reservations = [];

/**
 * Load raw JSON, enrich products with status+charge, then
 * group into reservation objects.
 */
export async function loadCache() {
  try {
    const products = await readJson(ASSIGNMENTS_PATH);
    const charges = await readJson(CHARGES_PATH);

    // 1. Index charges by product ID
    const chargesMap = new Map();
    for (const charge of charges) {
      const arr = chargesMap.get(charge.special_product_assignment_id) || [];
      arr.push(charge);
      chargesMap.set(charge.special_product_assignment_id, arr);
    }
    // 2. Group products into reservations
    const map = new Map();
    for (const product of products) {
      const { id, reservation_uuid: reservationUuid, name } = product;
      // determine status & charge
      const chargesList = chargesMap.get(id) || [];
      let status = null; // default status offeredBy which we don't use
      let charge = null; // null if no charges
      for (const c of chargesList) {
        charge = c.amount;
        if (c.active) {
          status = "active";
          break;
        } else {
          status = "cancelled";
        }
      }

      // init reservation bucket if needed
      if (!map.has(reservationUuid)) {
        map.set(reservationUuid, {
          reservationUuid,
          products: [],
          activePurchasesSum: 0,
          activeChargesSum: 0,
        });
      }

      // add product and update sums
      const bucket = map.get(reservationUuid);
      bucket.products.push({ id, name, status, charge });
      if (status === "active") {
        bucket.activePurchasesSum += 1;
        bucket.activeChargesSum += charge;
      }
    }

    // 3. Persist array of reservation objects
    reservations = Array.from(map.values());
  } catch (err) {
    console.error("❌ Failed to load JSON cache:", err);
    process.exit(1); // fail-fast on startup error
  }
}

// load the cache at import time
(async function initCache() {
  try {
    await loadCache();
  } catch (err) {
    console.error("❌ Cache failed to load:", err);
    process.exit(1);
  }
})();

/**
 * Fetch next page of reservations, starting *after* the given reservationUuid.
 * @param {string|null} lastUuid – UUID of the last reservation seen (null => start at 0)
 * @param {number} limit – how many reservations to return
 */
export function getReservationsAfter(lastUuid = null, limit = 20) {
  let startIndex = 0;
  if (lastUuid !== null) {
    const idx = reservations.findIndex((r) => r.reservationUuid === lastUuid);
    if (idx === -1) {
      // If lastUuid not found, return empty array
      return [];
    }
    if (idx >= 0) startIndex = idx + 1;
  }
  return reservations.slice(startIndex, startIndex + limit);
}
