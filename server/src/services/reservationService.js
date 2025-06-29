export function processReservations(productAssignments, productCharges) {
  const productsMap = new Map();
  for (let product of productAssignments) {
    // Initialize the reservation entry in the map
    const { id, name, reservation_uuid } = product;
    productsMap.set(id, {
      name: name,
      status: "offeredOnly", // Default status for products without charges
      reservationUuid: reservation_uuid,
      charge: null,
    });
  }

  // Process charges to update the products status and charge amounts
  // If a charge is active, it will update the product status to "active" and set the charge amount
  // If a charge is inactive, it will set the product status to "cancelled"
  for (let charge of productCharges) {
    const productId = charge.special_product_assignment_id;
    // Update product status to either active or cancelled based on charge active boolean
    if (productsMap.has(productId)) {
      const product = productsMap.get(productId);
      if (charge.active === true) {
        product.status = "active";
        product.charge = charge.amount || 0;
      } else if (charge.active === false) {
        product.status = "cancelled";
      }
    } else {
      // Charge without reservation
      console.warn(
        `Charge found for reservation_id ${productId} not in assignments`
      );
    }
  }

  // Arrange products into reservations
  const reservations = new Map();
  for (let product of productsMap.values()) {
    const { reservationUuid, charge, status } = product;
    if (!reservations.has(reservationUuid)) {
      const isActivePurchase = status === "active";
      reservations.set(reservationUuid, {
        reservationUuid,
        products: [product],
        activePurchasesSum: isActivePurchase ? 1 : 0,
        activeChargesSum: isActivePurchase ? charge : 0,
      });
    } else {
      // Update existing reservation with new product
      const reservation = reservations.get(reservationUuid);
      reservation.products.push(product);
      // Update meta information
      if (product.status === "active") {
        reservation.activePurchasesSum += 1;
        reservation.activeChargesSum += product.charge;
      }
    }
  }
  return Array.from(reservations.values());
}
