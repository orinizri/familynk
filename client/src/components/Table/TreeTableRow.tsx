import React from "react";
import { TableRow, TableCell } from "@mui/material";
export interface UserRowData {
  id: string;
  name: string;
  privacy: string;
  created_at: string;
  updated_at: string;
}

interface UsersTableRowProps {
  tree: UserRowData;
}

export default function TreesTableRow({ tree }: UsersTableRowProps) {
  return (
    <TableRow
      hover
      sx={{
        "&:hover": {
          backgroundColor: "#f9fafb",
        },
      }}
    >
      {" "}
      <TableCell sx={cellSx}>{tree.id}</TableCell>
      <TableCell sx={cellSx}>{tree.name}</TableCell>
      <TableCell sx={cellSx}>{tree.privacy}</TableCell>
      <TableCell sx={cellSx}>
        {typeof tree.created_at === "string"
          ? new Date(tree.created_at).toLocaleDateString()
          : "-"}
      </TableCell>
      <TableCell sx={cellSx}>
        {typeof tree.updated_at === "string" &&
        new Date(tree.updated_at).getTime() !== 0
          ? new Date(tree.updated_at).toLocaleDateString()
          : "-"}
      </TableCell>
    </TableRow>
  );
}

const cellSx = {
  textAlign: "center",
  fontSize: "0.9rem",
  color: "#333",
  borderBottom: "1px solid #e5e7eb",
  py: 1.5,
};
