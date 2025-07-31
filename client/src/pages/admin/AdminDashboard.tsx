import React from "react";
// import { useState } from "react";
import UsersTable from "../../components/AdminDashboard/UsersTable";
// import { PaginationType } from "shared/types/pagination.types";

export default function AdminDashboard() {
  // const [filters, setFilters] = useState<Partial<PaginationType>>({});

  return (
    <>
      <h2 style={{ textAlign: "center" }}>All Users</h2>
      <UsersTable />
    </>
  );
}
