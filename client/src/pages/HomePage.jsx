// src/pages/HomePage.jsx
import { useAuth } from "../contexts/authContext";

export default function HomePage() {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: "2rem" }}>
      <h1>Welcome {user?.first_name}!</h1>
      <button onClick={logout}>Logout</button>
    </div>
  );
}
