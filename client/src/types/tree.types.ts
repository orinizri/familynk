import { PaginationType } from "./pagination.types";

export interface productsProps {
  id: string;
  name: string;
  status?: string;
  charge?: number;
}

export interface reservationRowProps {
  id: string;
  activePurchasesSum: number;
  activeChargesSum: number;
  products?: productsProps[];
}

export interface Tree {
  id: string;
  name: string;
  user_id: string;
  privacy: "public" | "private";
  created_at: string;
  updated_at: string;
}

export interface FetchTreesOptions {
  user_id: string;
  filters: PaginationType;
}

export interface FetchTreesResponse {
  trees?: Tree[];
  pageCount?: number | null;
}

export interface CreateTreesResponse {
  tree?: Tree;
}
