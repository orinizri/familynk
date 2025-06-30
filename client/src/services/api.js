import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export function getReservations({ cursor = 0, limit = 20 } = {}) {
  return api
    .get("/reservations", { params: { cursor, limit } })
    .then((res) => res.data);
}

export default api;
