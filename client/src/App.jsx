import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Unauthorized from "./pages/Unauthorized";
import RoleBasedWrapper from "./components/RoleBasedWrapper";
import AdminDashboard from "./components/AdminDashboard";

export default function App() {
  return (
    <Routes>
      <Route path="/unauthorized" element={<Unauthorized />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route
        path="/admin-dashboard"
        element={
          <RoleBasedWrapper allowedRoles={["admin"]}>
            <AdminDashboard />
          </RoleBasedWrapper>
        }
      />
      <Route
        path="/home"
        element={
          <RoleBasedWrapper allowedRoles={["user", "admin"]}>
            <HomePage />
          </RoleBasedWrapper>
        }
      />
    </Routes>
  );
}
