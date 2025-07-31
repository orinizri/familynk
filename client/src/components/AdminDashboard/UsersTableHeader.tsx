import React from "react";
import { adminColumns } from "../../utils/constants";
import styles from "./users_table.module.css";
import { PaginationType, SortOrder } from "../../types/pagination.types";

// 🔠 Column definition type (can be shared)
export interface TableColumn {
  key: string;
  label: string;
  sortable?: boolean;
}

interface UsersTableHeaderProps extends Partial<PaginationType> {
  columns?: TableColumn[];
  onSort: (key: string, order: SortOrder) => void;
  order: SortOrder;
}

export default function UsersTableHeader({
  columns = adminColumns,
  sortBy,
  order,
  onSort,
}: UsersTableHeaderProps) {
  const handleSort = (field: string): void => {
    const nextOrder: SortOrder =
      field === sortBy && order === "asc" ? "desc" : "asc";
    onSort(field, nextOrder);
  };

  function createHeaders(): React.ReactElement[] {
    const headers: React.ReactElement[] = [];

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
          >
            index
          </th>
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
            textDecoration: "none",
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
