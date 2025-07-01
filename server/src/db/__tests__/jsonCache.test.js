// server/src/db/__tests__/jsonCache.test.mjs
import { loadCache, getReservationsAfter } from "../jsonCache.js";
import path from "path";

describe("getReservationsAfter()", () => {
  beforeAll(async () => {
    // Point to your JSON fixtures
    process.env.ASSIGNMENTS_PATH = path.resolve("data/product_assignment.json");
    process.env.CHARGES_PATH = path.resolve("data/product_charges.json");
    await loadCache();
  });

  it("returns the first `limit` items if lastUuid is null", () => {
    const firstBatch = getReservationsAfter(null, 3);
    expect(firstBatch).toHaveLength(3);
    // Ensure they’re sorted and unique
    const ids = firstBatch.map((r) => r.reservationUuid);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toEqual(ids.slice().sort((a, b) => a - b));
  });

  it("returns the next batch after the given UUID", () => {
    const initial = getReservationsAfter(null, 2);
    const lastId = initial[initial.length - 1].reservationUuid;
    const next = getReservationsAfter(lastId, 2);
    // No overlap
    initial.forEach((r) => expect(next.map((n) => n.reservationUuid)).not.toContain(r.reservationUuid));
  });

  it("returns an empty array when given a UUID that doesn't exist", () => {
    const nonExistentUuid = "00000000-0000-0000-0000-000000000000";
    const result = getReservationsAfter(nonExistentUuid, 5);
    expect(result).toEqual([]);
  });

  it("defaults limit to 20 when not provided", () => {
    const batchWithDefault = getReservationsAfter(null);
    const batchExplicit = getReservationsAfter(null, 20);
    expect(batchWithDefault).toEqual(batchExplicit);
  });
});
