import { useState, useEffect, useCallback, useRef } from "react";
import api from "../services/api";
import { reservationRowProps } from "@client/types/reservation.types";


// ✨ API response structure
interface ReservationApiResponse {
  reservations: reservationRowProps[];
  nextCursor: string | null;
}

// ✨ Hook return type
interface UseReservationsResult {
  reservations: reservationRowProps[];
  loadMore: () => void;
  loading: boolean;
  error: boolean;
  hasMore: boolean;
}

export default function useReservations(limit = 20): UseReservationsResult {
  const [reservations, setReservations] = useState<reservationRowProps[]>([]);
  const [cursor, setCursor] = useState<string | undefined>(undefined);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<boolean>(false);
  const [hasMore, setHasMore] = useState<boolean>(true);

  const initialFetchRan = useRef<boolean>(false);
  const lastRequestedCursor = useRef<string | undefined>(undefined);

  const loadMore = useCallback((): void => {
    void (async () => {
      if (loading || !hasMore) return;
      if (lastRequestedCursor.current && cursor === lastRequestedCursor.current)
        return;

      lastRequestedCursor.current = cursor;

      setLoading(true);
      setError(false);

      const params = new URLSearchParams({ limit: String(limit) });
      if (cursor !== undefined) {
        params.set("cursor", cursor);
      }

      try {
        const res = await api.get<ReservationApiResponse>(
          `/reservations?${params.toString()}`
        );
        const { reservations: newItems, nextCursor } = res.data;

        setReservations((prev) => [...prev, ...newItems]);

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
    })();
  }, [cursor, limit, loading, hasMore]);

  useEffect(() => {
    if (initialFetchRan.current) return;
    initialFetchRan.current = true;
    void loadMore();
  }, [loadMore]);

  return { reservations, loadMore, loading, error, hasMore };
}
