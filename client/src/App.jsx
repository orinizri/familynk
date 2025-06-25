import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Unauthorized from "./pages/Unauthorized";
import RoleBasedWrapper from "./components/RoleBased/RoleBasedWrapper";
import AdminDashboard from "./pages/admin/AdminDashboard";
import Layout from "./components/Layout/Layout";
import Profile from "./components/Auth/Profile/Profile";

export default function App() {
  return (
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
        <Route element={<RoleBasedWrapper allowedRoles={["user", "admin"]} />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Route>
    </Routes>
  );
}
