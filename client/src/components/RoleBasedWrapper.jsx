import { useAuth } from "../contexts/authContext";
import { Navigate } from "react-router-dom";

export default function RoleBasedRoute({ allowedRoles = [], children }) {
  const { user, loading } = useAuth();
  if (loading) {
    return <p>Loading session...</p>;
  }
  if (!user) return <Navigate to="/login" replace />;

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return children;
}
