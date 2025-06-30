import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000",
  headers: {
    "Content-Type": "application/json",
  },
});

export function getReservations() {
  return api.get("/").then((res) => res.data);
}

export default api;
