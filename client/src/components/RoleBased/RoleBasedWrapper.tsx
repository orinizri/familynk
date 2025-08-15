import React, { ReactElement } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../../contexts/authContext";
import DelayedFallback from "../Layout/DelayedFallback";

interface RoleBasedWrapperProps {
  fallback?: React.ReactNode;
  allowedRoles?: string[];
}

export default function RoleBasedWrapper({
  fallback = <Navigate to="/unauthorized" replace />,
  allowedRoles = [],
}: RoleBasedWrapperProps): ReactElement | null {
  const { user, loading } = useAuth();

  if (loading) return <DelayedFallback />;
  if (!user) return <Navigate to="/login" replace />;
  if (user && !user.email_verified) return <Navigate to="/verify-email" />;

  const userRole =
    typeof user?.role === "string" ? user.role.toLowerCase() : "user";

  const roleAllowed = allowedRoles
    .map((r: string) => r.toLowerCase())
    .includes(userRole);

  return roleAllowed ? <Outlet /> : <>{fallback}</>;
}
