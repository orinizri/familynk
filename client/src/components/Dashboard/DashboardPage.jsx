import React from "react";
import { Box, CircularProgress, Alert, Typography } from "@mui/material";
import useReservations from "../../hooks/useReservations";
import ReservationAccordion from "./ReservationAccordion";

export default function DashboardPage() {
  const { reservations, loading, error } = useReservations();

  if (loading)
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  if (error) return <Alert severity="error">{error}</Alert>;
  if (reservations.length === 0)
    return <Typography>No reservations found.</Typography>;

  return (
    <Box display="flex" flexDirection="column" gap={2}>
      {reservations.map((r) => {
        console.log(r);
        return <ReservationAccordion key={r.reservationUuid} reservation={r} />;
      })}
    </Box>
  );
}
