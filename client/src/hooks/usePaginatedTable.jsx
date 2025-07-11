import { useState, useEffect, useCallback } from "react";

/**
 * usePaginatedTable - General hook for paginated, filterable table data.
 *
 * @param {Function} resourceFn - async function accepting ({ filters, pagination }) and returning { data, meta }
 * @param {Object} options - optional config with initialFilters and initialPagination
 */
export default function usePaginatedTable(resourceFn, options = {}) {
  const { initialFilters = {}, initialPagination = { page: 1, limit: 10 } } =
    options;

  const [data, setData] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState(initialPagination);
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await resourceFn({ filters, pagination });
      setData(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to fetch data:", err);
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [filters, pagination, resourceFn]);

  useEffect(() => {
    load();
  }, [load]);

  // Pagination helpers
  const setPage = (page) => setPagination((prev) => ({ ...prev, page }));

  const setLimit = (limit) =>
    setPagination((prev) => ({ ...prev, page: 1, limit }));

  const updateFilters = (newFilters) => {
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
