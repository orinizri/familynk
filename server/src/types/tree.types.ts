export interface Tree {
  id: string;
  name: string;
  user_id: string;
  privacy: "public" | "private";
}

export interface FetchTreesOptions {
  cursor?: string;
  limit?: number;
}

export interface FetchTreesResponse {
  trees?: Tree[];
  nextCursor?: string | null;
}

export interface CreateTreesResponse {
  tree?: Tree;
}
