import { PaginationType } from "@client/types/pagination.types";
import { fetchTrees } from "../api/treesApi";
import usePaginatedTable from "./usePaginatedTable";

export function useTrees(initialFilters: Partial<PaginationType> = {}) {
  return usePaginatedTable(fetchTrees, { initialFilters });
}
