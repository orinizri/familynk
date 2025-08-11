import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import RoleBasedWrapper from "./components/RoleBased/RoleBasedWrapper";

// Lazy loading components to optimize performance
const Lazy = {
  Layout: lazy(() => import("./components/Layout/Layout")),
  HomePage: lazy(() => import("./pages/HomePage")),
  Profile: lazy(() => import("./components/Auth/Profile/Profile")),
  LoginPage: lazy(() => import("./pages/LoginPage")),
  RegisterPage: lazy(() => import("./pages/RegisterPage")),
  Unauthorized: lazy(() => import("./pages/Unauthorized")),
  TreesDashboard: lazy(() => import("./pages/trees/TreeDashboard")),
  verifyEmailPage: lazy(() => import("./pages/verifyEmailPage")),
};

// Main App component with routing
export default function App() {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          <Route element={<Lazy.Layout />}>
            {/* Public Routes */}
            <Route path="/unauthorized" element={<Lazy.Unauthorized />} />
            <Route path="/login" element={<Lazy.LoginPage />} />
            <Route path="/register" element={<Lazy.RegisterPage />} />
            <Route path="/verify-email" element={<Lazy.verifyEmailPage />} />

            {/* Protected Routes */}
            <Route
              element={<RoleBasedWrapper allowedRoles={["user", "admin"]} />}
            >
              <Route path="/" element={<Lazy.HomePage />} />
              <Route path="/profile" element={<Lazy.Profile />} />
              <Route path="/trees" element={<Lazy.TreesDashboard />} />
            </Route>
          </Route>
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
