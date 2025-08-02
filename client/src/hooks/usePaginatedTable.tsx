import { fetchTreesHookResponse } from "@client/api/treesApi";
import { PaginationType } from "@client/types/pagination.types";
import { useState, useEffect, useCallback } from "react";

/**
 * usePaginatedTable - General hook for paginated, filterable table data.
 *
 * @param {Function} resourceFn - async function accepting ({ filters, pagination }) and returning { data, meta }
 * @param {Object} options - optional config with initialFilters and initialPagination
 */

interface OptionsType {
  initialFilters?: Partial<PaginationType>;
  initialPagination?: Partial<PaginationType>;
}
export default function usePaginatedTable(
  resourceFn: (params: {
    filters: Partial<PaginationType>;
    pagination: Partial<PaginationType>;
  }) => Promise<fetchTreesHookResponse>,
  options: OptionsType = {}
) {
  const { initialFilters = {}, initialPagination = { page: 1, limit: 10 } } =
    options;

  const [data, setData] = useState([]);
  const [filters, setFilters] =
    useState<Partial<PaginationType>>(initialFilters);
  const [pagination, setPagination] =
    useState<Partial<PaginationType>>(initialPagination);
  const [meta, setMeta] = useState<{ pageCount: null | number }>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceFn({ filters, pagination });
      console.log("Resource function response:", res);
      if (!res || !res.data || !res.success) {
        throw new Error("Invalid response from resource function");
      }
      setData(res.data.data);
      setMeta(res.data.meta || { pageCount: null });
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError("Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, resourceFn]);

  useEffect(() => {
    void load();
  }, [load]);

  // Pagination helpers
  const setPage = (page: number) =>
    setPagination((prev) => ({ ...prev, page }));

  const setLimit = (limit: number) =>
    setPagination((prev) => ({ ...prev, page: 1, limit }));

  const updateFilters = (newFilters: Partial<PaginationType>) => {
    console.log("Updating filters:", newFilters);
    setFilters((prev) => {
      const updated = { ...prev, ...newFilters };
      // Avoid unnecessary updates
      if (JSON.stringify(updated) === JSON.stringify(prev)) return prev;
      return updated;
    });
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return {
    data,
    filters,
    pagination,
    meta,
    loading,
    error,
    setFilters,
    setPagination,
    updateFilters,
    setPage,
    setLimit,
    reload: load,
  };
}
