// /**
//  * @fileoverview
//  * Integration‐style unit tests for fetchReservations()
//  * — uses the real cache helper against your JSON fixtures.
//  */

// import path from "path";
// import { loadCache, getReservationsAfter } from "../../db/jsonCache";
// import { fetchReservations } from "../reservationService";

// describe("fetchReservations() with real JSON data", () => {
//   beforeAll(async () => {
//     // Point at your test fixtures (adjust paths as needed)
//     process.env.ASSIGNMENTS_PATH = path.resolve("data/product_assignment.json");
//     process.env.CHARGES_PATH = path.resolve("data/product_charges.json");
//     // Load into memory
//     await loadCache();
//   });

//   it("returns first page when no cursor provided", async () => {
//     const { reservations, nextCursor } = await fetchReservations({
//       cursor: null,
//       limit: 3,
//     });
//     expect(Array.isArray(reservations)).toBe(true);
//     // Should return exactly 3 items unless your JSON has fewer than 3 distinct reservations
//     expect(reservations.length).toBeLessThanOrEqual(3);
//     // The nextCursor should equal the last reservationUuid in that slice
//     const last = reservations[reservations.length - 1].reservationUuid;
//     expect(nextCursor).toBe(last);
//   });

//   it("fetches page 2 with no overlap and correct length", async () => {
//     // 1) get page 1
//     const { reservations: page1, nextCursor } = await fetchReservations({
//       cursor: null,
//       limit: 3,
//     });
//     expect(page1.length).toBeLessThanOrEqual(3);
//     expect(nextCursor).not.toBeNull();

//     // 2) get page 2
//     const { reservations: page2, nextCursor: cursor2 } =
//       await fetchReservations({
//         cursor: nextCursor,
//         limit: 3,
//       });

//     // 3) ensure page2 items are distinct from page1
//     const uuids1 = new Set(page1.map((r) => r.reservationUuid));
//     page2.forEach((r) => {
//       expect(uuids1.has(r.reservationUuid)).toBe(false);
//     });

//     // 4) page2 length is <= limit
//     expect(page2.length).toBeLessThanOrEqual(3);

//     // 5) nextCursor advances again (or null at end)
//     if (page2.length > 0) {
//       const last2 = page2[page2.length - 1].reservationUuid;
//       expect(cursor2).toBe(last2);
//     } else {
//       expect(cursor2).toBeNull();
//     }
//   });

//   it("returns empty + null when cursor is beyond all UUIDs", async () => {
//     const bogus = "00000000-0000-0000-0000-000000000000";
//     const { reservations, nextCursor } = await fetchReservations({
//       cursor: bogus,
//       limit: 5,
//     });
//     expect(reservations).toEqual([]);
//     expect(nextCursor).toBeNull();
//   });

//   it("courses through pages until no more left", async () => {
//     let cursor = null;
//     let all = [];
//     // keep fetching until nextCursor is null
//     do {
//       const { reservations, nextCursor } = await fetchReservations({
//         cursor,
//         limit: 50,
//       });
//       all = all.concat(reservations.map((r) => r.reservationUuid));
//       cursor = nextCursor;
//     } while (cursor);

//     // Deduplicate & compare against total from cache helper
//     const totalUuids = new Set(all);
//     expect(totalUuids.size).toBe(getReservationsAfter(null, Infinity).length);
//   });

//   it("when limit > total reservations, same behavior as above", async () => {
//     const { reservations, nextCursor } = await fetchReservations({
//       cursor: null,
//       limit: 10000,
//     });

//     // we know total < 9999
//     expect(reservations.length).toBeLessThan(9999);
//     expect(nextCursor).toBeNull();
//   });

//   it("when cursor equals last UUID, returns empty & nextCursor null", async () => {
//     // page through once to get the very last UUID
//     const { reservations } = await fetchReservations({
//       cursor: null,
//       limit: 10000,
//     });
//     const lastUuid = reservations[reservations.length - 1].reservationUuid;
//     const result = await fetchReservations({
//       cursor: lastUuid,
//       limit: 5,
//     });
//     expect(result.reservations).toEqual([]);
//     expect(result.nextCursor).toBeNull();
//   });
// });
