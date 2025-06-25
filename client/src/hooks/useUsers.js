import { useState, useEffect, useCallback } from "react";
import { fetchUsers } from "../api/usersApi";

export function useUsers(initialFilters = {}, initialPagination = {}) {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState(initialFilters);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    ...initialPagination,
  });
  const [meta, setMeta] = useState(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchUsers({ filters, pagination });
      setUsers(res.data);
      setMeta(res.meta);
    } catch (err) {
      console.error("Failed to fetch users", err);
    } finally {
      setLoading(false);
    }
  }, [filters, pagination]);

  useEffect(() => {
    load();
  }, [filters, pagination, load]);

  return {
    users,
    loading,
    filters,
    pagination,
    meta,
    setFilters,
    setPagination,
    reload: load,
  };
}
