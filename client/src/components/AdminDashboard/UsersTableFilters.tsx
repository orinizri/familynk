import React, { ChangeEvent } from "react";
import { PaginationType } from "shared/types/pagination.types";

// 2️⃣ Define the props
interface UsersTableFiltersProps {
  filters: Partial<PaginationType>;
  updateFilters: (newFilters: Partial<PaginationType>) => void;
}

export default function UsersTableFilters({
  filters,
  updateFilters,
}: UsersTableFiltersProps) {
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    updateFilters({ [name]: value });
  };

  return (
    <div
      style={{
        display: "flex",
        gap: "1rem",
        flexWrap: "wrap",
        marginBottom: "1rem",
        justifyContent: "center",
      }}
    >
      <input
        type="text"
        name="email"
        placeholder="Search email"
        value={String(filters?.email) || ""}
        onChange={handleChange}
      />

      <select
        name="role"
        value={String(filters?.role) || ""}
        onChange={handleChange}
      >
        <option value="">All Roles</option>
        <option value="user">User</option>
        <option value="admin">Admin</option>
      </select>

      <div>
        <label>
          From:
          <input
            type="date"
            name="startDate"
            onChange={handleChange}
            min={filters?.startDate ? String(filters.startDate) : undefined}
            value={filters?.endDate ? String(filters.startDate) : ""}
          />
        </label>
      </div>

      <div>
        <label>
          To:
          <input
            type="date"
            name="endDate"
            onChange={handleChange}
            min={filters?.startDate ? String(filters.startDate) : undefined}
            value={filters?.endDate ? String(filters.startDate) : ""}
          />
        </label>
      </div>
    </div>
  );
}
