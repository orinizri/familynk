import { useEffect, useState } from "react";
import { getReservations } from "../services/api";

export default function useReservations() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getReservations()
      .then((data) => {
        if (!data.success) {
          throw new Error(data.message || "Failed to fetch reservations");
        }
        setReservations(data.data || []);
      })
      .catch((err) => setError(err.message || "Error"))
      .finally(() => setLoading(false));
  }, []);

  return { reservations, loading, error };
}
