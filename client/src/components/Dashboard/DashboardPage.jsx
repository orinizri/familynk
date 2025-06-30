import React, { useRef } from "react";
import { Stack, Box, Button, CircularProgress, Alert } from "@mui/material";
import useReservations from "../../hooks/useReservations";
import ReservationHeaderRow from "./ReservationHeaderRow";
import ReservationAccordion from "./ReservationAccordion";
import useInfiniteScrollContainer from "../../hooks/useInfiniteScrollContainer";

export default function DashboardPage() {
  const { reservations, loadMore, loading, error, hasMore } =
    useReservations(20);

  // Ref for the scrollable container
  const containerRef = useRef(null);

  // Attach infinite-scroll to that container
  useInfiniteScrollContainer({
    containerRef,
    loading,
    hasMore,
    error,
    onLoadMore: loadMore,
    thresholdPx: 150,
  });

  // initial loading
  if (loading && reservations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // error on initial load
  if (error && reservations.length === 0) {
    return (
      <Alert severity="error">
        Failed to load reservations. <Button onClick={loadMore}>Retry</Button>
      </Alert>
    );
  }

  if (reservations.length === 0) {
    return <Alert severity="info">No reservations found.</Alert>;
  }

  return (
    // Give the container a max-height and enable scrolling
    <Box
      ref={containerRef}
      sx={{
        height: "calc(100vh - 64px)", // adjust 64px if you have a top AppBar
        overflowY: "auto",
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", px: 2, py: 1 }}>
        <ReservationHeaderRow />

        {reservations.map((r) => (
          <ReservationAccordion key={r.reservationUuid} reservation={r} />
        ))}

        {loading && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {error && (
          <Alert severity="error">
            Error loading more. <Button onClick={loadMore}>Try Again</Button>
          </Alert>
        )}

        {!hasMore && (
          <Box textAlign="center" p={2}>
            <em>No more reservations</em>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
