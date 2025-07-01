import api from "../services/api.js";
/**
 * useReservations
 *
 * A React hook that manages cursor-based pagination over your reservations API.
 * - Fetches the first page on mount
 * - Exposes loading, error, hasMore flags
 * - Exposes loadMore() to fetch the next page
 *
 * @param {number} limit – how many reservations to fetch per page
 * @returns {{
 *   reservations: Array<object>,
 *   loadMore:       Function,
 *   loading:        boolean,
 *   error:          boolean,
 *   hasMore:        boolean
 * }}
 */
import { useState, useEffect, useCallback, useRef } from "react";

export default function useReservations(limit = 20) {
  // The aggregated list of reservations fetched so far
  const [reservations, setReservations] = useState([]);
  // The cursor for the next page; undefined until set by server
  const [cursor, setCursor] = useState(undefined);
  // Flags to track loading / error states
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);
  // Indicates whether more pages remain
  const [hasMore, setHasMore] = useState(true);

  // ref to prevent double-invocation in Strict Mode
  const initialFetchRan = useRef(false);

  // Ref to remember which cursor we last fetched
  const lastRequestedCursor = useRef(undefined);

  /**
   * loadMore
   *
   * Fetches the next page of reservations.
   * Guards against concurrent loads or loading past the end.
   */
  const loadMore = useCallback(async () => {
    console.log("useReservations loadMore called with:", {
      cursor,
      limit,
      loading,
      hasMore,
    });
    // Prevent duplicate or invalid fetches
    if (loading || !hasMore) return;

    // Prevent repeat fetch for the same cursor
    if (lastRequestedCursor.current && cursor === lastRequestedCursor.current)
      return;
    lastRequestedCursor.current = cursor;

    setLoading(true);
    setError(false);

    // Build the query string: include cursor only if defined
    const params = new URLSearchParams({ limit: String(limit) });
    if (cursor !== undefined) {
      params.set("cursor", String(cursor));
    }
    console.log("useReservations loadMore params:", params.toString());
    try {
      const res = await api.get(`/reservations?${params}`);
      const { reservations: newItems, nextCursor } = res.data;
      console.log("useReservations loadMore response:", newItems, nextCursor);
      // Append the new page of reservations
      setReservations((prev) => [...prev, ...newItems]);

      // If server signals end (nextCursor===null), disable further loads
      if (nextCursor == null) {
        setHasMore(false);
      } else {
        setCursor(nextCursor);
      }
    } catch (e) {
      console.error("useReservations loadMore failed:", e);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [cursor, limit, loading, hasMore]);

  // On first render, kick off the initial fetch
  useEffect(() => {
    // Only call loadMore() the first time—even if Strict Mode mounts twice
    if (initialFetchRan.current) return;
    initialFetchRan.current = true;
    loadMore();
  }, [loadMore]);

  return { reservations, loadMore, loading, error, hasMore };
}
