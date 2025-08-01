import React from "react";
import styles from "./users_table.module.css";

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

export default function UsersTableRow({ tree }: UsersTableRowProps) {
  return (
    <tr className={styles.tr}>
      <td className={styles.td}>{tree.id}</td>
      <td className={styles.td}>{tree.name}</td>
      <td className={styles.td}>{tree.privacy}</td>
      <td className={styles.td}>
        {typeof tree.created_at === "string"
          ? new Date(tree.created_at).toLocaleDateString()
          : "-"}
      </td>
      <td className={styles.td}>
        {typeof tree.updated_at === "string" && (new Date(tree.updated_at).getTime() !== 0)
          ? new Date(tree.updated_at).toLocaleDateString()
          : "-"}
      </td>
    </tr>
  );
}
