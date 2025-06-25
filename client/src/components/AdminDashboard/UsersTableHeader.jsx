import React from "react";
import { adminColumns } from "../../utils/constants";
import styles from "./users_table.module.css";

export default function UsersTableHeader({
  columns = adminColumns,
  sortBy,
  order,
  onSort,
}) {
  const handleSort = (field) => {
    if (field === sortBy) {
      onSort(field, order === "asc" ? "desc" : "asc");
    } else {
      onSort(field, "asc");
    }
  };

  function createHeaders() {
    const headers = [];
    for (let i = -1; i < columns.length; i++) {
      if (i === -1) {
        headers.push(
          <th
            className={styles.th}
            key="select"
            style={{
              cursor: "default",
              textDecoration: "none",
              fontWeight: "normal",
            }}
          ></th>
        );
        continue;
      }
      const { key, label, sortable } = columns[i];
      headers.push(
        <th
          className={styles.th}
          key={key}
          onClick={sortable ? () => handleSort(key) : undefined}
          role={sortable ? "button" : undefined}
          tabIndex={sortable ? 0 : undefined}
          style={{
            cursor: sortable ? "pointer" : "default",
            textDecoration: sortBy === key ? "underline" : "none",
            fontWeight: sortBy === key ? "bold" : "normal",
          }}
        >
          {label}
          {sortable && sortBy === key && (order === "asc" ? " 🔼" : " 🔽")}
        </th>
      );
    }
    return headers;
  }

  return (
    <thead>
      <tr className={styles.tr}>{createHeaders()}</tr>
    </thead>
  );
}
