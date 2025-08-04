import React from "react";
import styles from "./users_table.module.css";
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
    <TableRow className={styles.tr}>
      <TableCell className={styles.td}>
        {tree.id}
      </TableCell>
      <TableCell className={styles.td}>
        {tree.name}
      </TableCell>
      <TableCell className={styles.td}>
        {tree.privacy}
      </TableCell>
      <TableCell className={styles.td}>
        {typeof tree.created_at === "string"
          ? new Date(tree.created_at).toLocaleDateString()
          : "-"}
      </TableCell>
      <TableCell className={styles.td}>
        {typeof tree.updated_at === "string" &&
        new Date(tree.updated_at).getTime() !== 0
          ? new Date(tree.updated_at).toLocaleDateString()
          : "-"}
      </TableCell>
    </TableRow>
  );
}
