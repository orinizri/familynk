import { fetchUsers } from "../api/usersApi";
import usePaginatedTable from "./usePaginatedTable";

export function useUsers(initialFilters = {}, initialPagination = {}) {
  return usePaginatedTable(fetchUsers, { initialFilters });
}
