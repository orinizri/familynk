import { fetchTreesHookResponse } from "@client/api/treesApi";
import { apiStatus } from "../constants/apiStatus";
import { PaginationType } from "@client/types/pagination.types";
import { useState, useEffect, useCallback, useRef } from "react";
import useApiStatus from "../api/hooks/useApiStatus";
import { didAbort } from "../api/api";
import { toast } from "react-toastify";

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
    abort: (abort: () => void) => void;
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
  const {
    status: tableStatus,
    setStatus: setTableStatus,
    statuses: {
      isIdle: isTableIdle,
      isSuccess: isTableSuccess,
      isError: isTableError,
      isPending: isTablePending,
    },
  } = useApiStatus(apiStatus.IDLE);
  // Abort controller reference to cancel ongoing requests
  const abortRef = useRef<(() => void) | null>(null);

  // Load data function
  const load = useCallback(async () => {
    setTableStatus(apiStatus.LOADING);
    try {
      const res = await resourceFn({
        filters,
        pagination,
        abort: (abort) => (abortRef.current = abort),
      });
      if (!res || !res.data || !res.success) {
        throw new Error("Invalid response from resource function");
      }
      setData(res.data.data);
      setMeta(res.data.meta || { pageCount: null });
      setTableStatus(apiStatus.SUCCESS);
    } catch (err) {
      if (didAbort(err)) {
        toast.info("Request aborted");
      } else {
        toast.info("Error fetching data");
      }
      toast.error(
        "Failed to fetch data:" +
          (err instanceof Error ? err.message : "Unknown error")
      );
      console.error("Error in usePaginatedTable load:", err);
      setTableStatus(apiStatus.ERROR);
    }
  }, [filters, pagination, resourceFn, setTableStatus]);

  useEffect(() => {
    void load();
  }, [load]);

  // Pagination helpers
  const setPage = (page: number) =>
    setPagination((prev) => ({ ...prev, page }));

  const setLimit = (limit: number) =>
    setPagination((prev) => ({ ...prev, page: 1, limit }));

  const updateFilters = (newFilters: Partial<PaginationType>) => {
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
    tableStatus,
    setTableStatus,
    isTableIdle,
    isTableSuccess,
    isTableError,
    isTablePending,
    setFilters,
    setPagination,
    updateFilters,
    setPage,
    setLimit,
    reload: load,
  };
}
