// src/hooks/useReservations.js
import { useState, useEffect, useCallback } from "react";
import { getReservations } from "../services/api";

export default function useReservations(initialLimit = 20) {
  const [reservations, setReservations] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Shared fetch logic
  const fetchBatch = useCallback(
    async (cursorParam) => {
      setLoading(true);
      setError(null);
      try {
        const { reservations: batch, nextCursor } = await getReservations({
          cursor: cursorParam,
          limit: initialLimit,
        });

        // For initial load (cursorParam===0), replace; otherwise append
        setReservations((prev) =>
          cursorParam === 0 ? batch : [...prev, ...batch]
        );

        setCursor(nextCursor || 0);
        setHasMore(Boolean(nextCursor));
      } catch (err) {
        console.error("Failed to load reservations:", err);
        setError(err);
      } finally {
        setLoading(false);
      }
    },
    [initialLimit]
  );

  // 1️⃣ Initial fetch — run only once, on mount
  useEffect(() => {
    fetchBatch(0);
  }, [fetchBatch]);

  // 2️⃣ loadMore triggers next batch
  const loadMore = useCallback(() => {
    if (loading || !hasMore) return;
    fetchBatch(cursor);
  }, [cursor, fetchBatch, loading, hasMore]);

  return { reservations, loadMore, loading, error, hasMore };
}
