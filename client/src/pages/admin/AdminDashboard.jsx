import { useAuth } from "../../contexts/authContext";
import Spinner from "../../components/Spinner/Spinner";

export default function AdminDashboard() {
  const { user, loading } = useAuth();

  if (loading) return <Spinner />;
  return <h2>Admin Dashboard</h2>;
}
