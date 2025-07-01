/**
 * DashboardPage
 *
 * Renders the paginated reservations inside a scrollable container.
 * Integrates infinite scrolling via useInfiniteScrollContainer().
 * Displays loading spinners, retry buttons, and end-of-list messages.
 */

import React, { useRef } from "react";
import { Stack, Box, Button, CircularProgress, Alert } from "@mui/material";
import useReservations from "../../hooks/useReservations";
import ReservationHeaderRow from "./ReservationHeaderRow";
import ReservationAccordion from "./ReservationAccordion";
import useInfiniteScrollContainer from "../../hooks/useInfiniteScrollContainer";

export default function DashboardPage() {
  // Fetch pages of 20 reservations at a time
  const { reservations, loadMore, loading, error, hasMore } =
    useReservations();
  // Ref to the scrollable Box; passed to the infinite-scroll hook
  const containerRef = useRef(null);

  // Attach the infinite-scroll listener to our container
  useInfiniteScrollContainer({
    containerRef,
    loading,
    hasMore,
    error,
    onLoadMore: loadMore,
    thresholdPx: 150, // trigger when 150px from bottom
  });

  // --- Initial loading state (before any data) ---
  if (loading && reservations.length === 0) {
    return (
      <Box display="flex" justifyContent="center" p={4}>
        <CircularProgress />
      </Box>
    );
  }

  // --- Initial load error ---
  if (error && reservations.length === 0) {
    return (
      <Alert severity="error">
        Failed to load reservations.{" "}
        <Button onClick={loadMore} size="small">
          Retry
        </Button>
      </Alert>
    );
  }

  // --- No data at all ---
  if (reservations.length === 0) {
    return <Alert severity="info">No reservations found.</Alert>;
  }

  // --- Main scrollable list ---
  return (
    <Box
      // Scrollable container
      ref={containerRef}
      sx={{
        height: "80vh", // fill most of viewport
        overflowY: "auto", // enable vertical scroll
      }}
    >
      <Stack spacing={2} sx={{ width: "100%", px: 2, py: 1 }}>
        {/* Table headers or summary row */}
        <ReservationHeaderRow />

        {/* Each reservation accordion */}
        {reservations.map((reservation) => (
          <ReservationAccordion
            key={reservation.reservationUuid}
            reservation={reservation}
          />
        ))}

        {/* Loading indicator at bottom during pagination */}
        {loading && (
          <Box display="flex" justifyContent="center" p={2}>
            <CircularProgress size={24} />
          </Box>
        )}

        {/* Error indicator at bottom during pagination */}
        {error && (
          <Alert severity="error">
            Error loading more.{" "}
            <Button onClick={loadMore} size="small">
              Try Again
            </Button>
          </Alert>
        )}

        {/* End‐of‐list message */}
        {!hasMore && !loading && (
          <Box textAlign="center" p={2}>
            <em>All reservations loaded.</em>
          </Box>
        )}
      </Stack>
    </Box>
  );
}
