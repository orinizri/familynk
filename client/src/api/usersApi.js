import api from "./api";

export async function fetchUsers({ filters = {}, pagination = {} }) {
  const params = {
    ...filters,
    page: pagination.page || 1,
    limit: pagination.limit || 10,
    sortBy: filters.sortBy || "created_at",
    order: filters.order || "desc",
  };
  const res = await api.get("/admin/users", { params });
  return res.data.data;
}
