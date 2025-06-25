import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import Spinner from "../Spinner/Spinner";

export default function RoleBasedWrapper({
  allowedRoles = [],
  fallback = <Navigate to="/unauthorized" replace />,
}) {
  const { user, loading } = useAuth();
  if (loading) return <Spinner />;
  if (!user) return <Navigate to="/login" replace />;

  const userRole = user?.role?.toLowerCase?.();
  const roleAllowed = allowedRoles
    .map((r) => r.toLowerCase())
    .includes(userRole);

  return roleAllowed ? <Outlet /> : fallback;
}
