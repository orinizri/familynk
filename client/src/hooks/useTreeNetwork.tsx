import { useState, useEffect, useCallback, useRef } from "react";
import { Person } from "../types/person.types";
import { ApiResponse } from "../types/auth.types";
import { fetchPersonsByTree } from "../api/personsApi";

// Hook return type
interface useTreeNetworkProps {
  persons: Person[];
  loading: boolean;
  error: string;
}

export default function useTreeNetwork(id: string): useTreeNetworkProps {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>("");

  const initialFetchRan = useRef(false);

  const load = useCallback((): void => {
    void (async () => {
      if (loading) return;

      setLoading(true);
      setError("");

      try {
        const res = await fetchPersonsByTree(id);
        const { success, data, error } = res as ApiResponse<Person[]>;
        if (!success) {
          throw new Error("use tree network error: " + error);
        }
        setPersons(data);
      } catch (error) {
        console.error("useTreeNetwork failed:", error);
        setError(
          error instanceof Error
            ? error.message
            : "An error occurred while fetching persons."
        );
      } finally {
        setLoading(false);
      }
    })();
  }, [loading, id]);

  useEffect(() => {
    if (initialFetchRan.current) return;
    initialFetchRan.current = true;
    void load();
  }, [load]);

  return { persons, loading, error };
}
