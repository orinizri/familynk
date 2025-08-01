export type PaginationType = {
  page: number;
  limit: number;
  sortBy: string;
  order: SortOrder;
  startDate?: string;
  endDate?: string;
};

export type PaginationTypeQueryParams = {
  page: string;
  limit: string;
  sortBy: string;
  order: SortOrder;
  startDate?: string;
  endDate?: string;
}

export type SortOrder = "asc" | "desc";
