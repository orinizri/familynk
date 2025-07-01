import axios from "axios";

const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL,
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
