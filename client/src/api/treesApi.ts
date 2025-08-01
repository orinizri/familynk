import api from "./api";
import { PaginationType } from "../types/pagination.types";
import { Tree } from "@client/types/tree.types";

export type fetchTreesHookResponse = {
  success: boolean;
  data: { data: Tree[]; meta: { pageCount: number } };
};

export async function fetchTrees({
  filters = {},
  pagination = {},
}: {
  filters?: Partial<PaginationType>;
  pagination?: Partial<PaginationType>;
}): Promise<fetchTreesHookResponse> {
  const params = {
    ...filters,
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    sortBy: filters.sortBy || "created_at",
    order: filters.order || "asc",
  } as PaginationType;
  const res = await api.get("/trees", { params });
  console.log("fetchTrees response:", res);
  return res.data as fetchTreesHookResponse;
}
