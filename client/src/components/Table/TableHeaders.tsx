import React from "react";
import { TableHead, TableRow, TableCell, TableSortLabel } from "@mui/material";
import { treeColumns } from "../../utils/constants";
import { PaginationType, SortOrder } from "../../types/pagination.types";

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

export default function TableHeaders({
  columns = treeColumns,
  sortBy,
  order,
  onSort,
}: UsersTableHeaderProps) {
  const handleSort = (key: string) => {
    const nextOrder: SortOrder =
      sortBy === key && order === "asc" ? "desc" : "asc";
    onSort(key, nextOrder);
  };

  return (
    <TableHead>
      <TableRow>
        {columns.map(({ key, label, sortable }) => (
          <TableCell
            key={key}
            sortDirection={sortBy === key ? order : false}
            sx={{
              textAlign: "center",
              fontWeight: sortBy === key ? "bold" : "normal",
              fontSize: "0.9rem",
              backgroundColor: "#f3f4f6",
              cursor: sortable ? "pointer" : "default",
              userSelect: "none",
              borderBottom: "1px solid #e5e7eb",
            }}
          >
            {sortable ? (
              <TableSortLabel
                active={sortBy === key}
                direction={sortBy === key ? order : "asc"}
                onClick={() => handleSort(key)}
                sx={{ display: "flex", justifyContent: "flex-start" }}
              >
                {label}
              </TableSortLabel>
            ) : (
              label
            )}
          </TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}
