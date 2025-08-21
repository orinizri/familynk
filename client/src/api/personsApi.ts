import { Person } from "../types/person.types";
import { api } from "./api";

export type fetchPersonsByTreeHookResponse = {
  success: boolean;
  data: Person[];
  error?: string;
};

export async function fetchPersonsByTree(
  treeId: string
): Promise<fetchPersonsByTreeHookResponse> {
  const res = await api.get(`/trees/${treeId}`);
  return res.data as fetchPersonsByTreeHookResponse;
}
