import api from "./api";
import { PaginationType } from "../types/pagination.types";
import { User } from "shared/types/user.types";

export async function fetchUsers({
  filters = {},
  pagination = {},
}: {
  filters?: Partial<PaginationType>;
  pagination?: Partial<PaginationType>;
}): Promise<{ data: User[]; meta: { pageCount: number } }> {
  const params = {
    ...filters,
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    sortBy: filters.sortBy || "created_at",
    order: filters.order || "asc",
  } as PaginationType;
  const res = await api.get("/admin/users", { params });
  return res.data as { data: User[]; meta: { pageCount: number } };
}
