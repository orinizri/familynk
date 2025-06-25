import { useState } from "react";
import UsersTable from "../../components/AdminDashboard/UsersTable";

export default function AdminDashboard() {
  const [filters, setFilters] = useState({});

  return (
    <>
      <h2 style={{ textAlign: "center" }}>All Users</h2>
      <UsersTable filters={filters} setFilters={setFilters} />
    </>
  );
}
