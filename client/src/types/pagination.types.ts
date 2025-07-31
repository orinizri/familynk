export type PaginationType = {
  page: number;
  limit: number;
  sortBy: string;
  order: SortOrder;
  email?: string;
  role?: string;
  startDate?: string;
  endDate?: string;
};

export type SortOrder = "asc" | "desc";
