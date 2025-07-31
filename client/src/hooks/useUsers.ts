import { PaginationType } from "shared/types/pagination.types";
import { fetchUsers } from "../api/usersApi";
import usePaginatedTable from "./usePaginatedTable";

export function useUsers(initialFilters: Partial<PaginationType> = {}) {
  return usePaginatedTable(fetchUsers, { initialFilters });
}
