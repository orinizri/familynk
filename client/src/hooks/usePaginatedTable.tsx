import { useState, useEffect, useCallback } from "react";
import { PaginationType } from "shared/types/pagination.types";
import { User } from "shared/types/user.types";

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
  }) => Promise<{ data: User[]; meta: { pageCount: null | number } }>,
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
      setData(res.data);
      setMeta(res.meta);
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
    setFilters((prev) => ({ ...prev, ...newFilters }));
    setPagination((prev) => ({ ...prev, page: 1 })); // reset page
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
