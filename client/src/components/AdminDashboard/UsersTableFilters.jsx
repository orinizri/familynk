import React from "react";

export default function UsersTableFilters({ filters, updateFilters }) {
  const handleChange = (e) => {
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
        value={filters?.email || ""}
        onChange={handleChange}
      />

      <select name="role" value={filters?.role || ""} onChange={handleChange}>
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
            value={filters?.startDate || ""}
            onChange={handleChange}
            max={filters?.endDate || undefined}
          />
        </label>
      </div>

      <div>
        <label>
          To:
          <input
            type="date"
            name="endDate"
            value={filters?.endDate || ""}
            onChange={handleChange}
            min={filters?.startDate || undefined}
          />
        </label>
      </div>
    </div>
  );
}
