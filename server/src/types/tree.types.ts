import { PaginationType } from "@client/types/pagination.types";

export interface Tree {
  id: string;
  name: string;
  user_id: string;
  privacy: "public" | "private";
  created_at: string;
  updated_at: string;
}

export interface FetchTreesMiddleware {
  success: boolean;
  data: Partial<PaginationType>;
}

export interface FetchTreesOptions {
  user_id: string;
  filters: Partial<PaginationType>;
}
export interface FetchTreesMetaResponse {
  pageCount: number;
}

export interface FetchTreesResponse {
  data: Tree[];
  meta: FetchTreesMetaResponse;
}

export interface CreateTreesResponse {
  tree?: Tree;
}
