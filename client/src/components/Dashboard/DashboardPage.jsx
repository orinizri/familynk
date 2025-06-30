// src/components/DashboardPage.jsx
import React from "react";
import { Stack, Box, Button, CircularProgress, Alert } from "@mui/material";
import useReservations from "../../hooks/useReservations";
import ReservationHeaderRow from "./ReservationHeaderRow";
import ReservationAccordion from "./ReservationAccordion";

export default function DashboardPage() {
  const { reservations, loadMore, loading, error, hasMore } =
    useReservations(20);

  if (loading && reservations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }
  if (error) {
    return <Alert severity="error">Error loading reservations.</Alert>;
  }
  if (reservations.length === 0) {
    return <Alert severity="info">No reservations found.</Alert>;
  }

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <ReservationHeaderRow />

      {reservations.map((r) => (
        <ReservationAccordion key={r.reservationUuid} reservation={r} />
      ))}

      {hasMore && (
        <Box textAlign="center" my={2}>
          <Button variant="contained" onClick={loadMore} disabled={loading}>
            {loading ? "Loading…" : "Load More"}
          </Button>
        </Box>
      )}
    </Stack>
  );
}
