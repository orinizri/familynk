export type PaginationType = {
  page: number;
  limit: number;
  sortBy: string;
  order: SortOrder;
  startDate?: string;
  endDate?: string;
  name?: string;
};

export type SortOrder = "asc" | "desc";
