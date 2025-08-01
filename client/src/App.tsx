import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import Layout from "./components/Layout/Layout";
import HomePage from "./pages/HomePage";
import Profile from "./components/Auth/Profile/Profile";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Unauthorized from "./pages/Unauthorized";
import AdminDashboard from "./pages/admin/AdminDashboard";
import RoleBasedWrapper from "./components/RoleBased/RoleBasedWrapper";
import TreesDashboard from "./pages/trees/TreeDashboard";

// Main application component that sets up routing and layout
export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/unauthorized" element={<Unauthorized />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Admin Routes */}
          <Route element={<RoleBasedWrapper allowedRoles={["admin"]} />}>
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          </Route>

          {/* User Routes */}
          <Route
            element={<RoleBasedWrapper allowedRoles={["user", "admin"]} />}
          >
            <Route path="/" element={<HomePage />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/trees" element={<TreesDashboard />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
