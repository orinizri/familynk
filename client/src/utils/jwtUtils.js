import { jwtDecode } from "jwt-decode";

export function getTokenExpiration(token) {
  try {
    const { exp } = jwtDecode(token);
    return exp * 1000; // convert to ms
  } catch {
    return null;
  }
}
