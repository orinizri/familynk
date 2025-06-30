/**
 * Defines the header columns for the reservations list.
 * @type {Array<{
 *   key: string,
 *   label: string,
 *   flex?: number,
 *   align?: 'left'|'center'|'right'
 * }>}
 */
export const RESERVATION_HEADERS = [
  { key: "reservationUuid", label: "Reservation UUID", flex: 1, align: "left" },
  {
    key: "activePurchases",
    label: "Active Purchases",
    flex: 1,
    align: "center",
  },
  { key: "activeCharges", label: "Active Charges", flex: 1, align: "center" },
];
