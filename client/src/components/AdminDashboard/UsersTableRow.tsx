import React from "react";
import styles from "./users_table.module.css";

export interface UserRowData {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: string;
  created_at: string;
}

interface UsersTableRowProps {
  user: UserRowData;
}

export default function UsersTableRow({ user }: UsersTableRowProps) {
  return (
    <tr className={styles.tr}>
      <td className={styles.td}>{user.id}</td>
      <td className={styles.td}>{user.email}</td>
      <td className={styles.td}>{user.first_name}</td>
      <td className={styles.td}>{user.last_name}</td>
      <td className={styles.td}>{user.role}</td>
      <td className={styles.td}>
        {new Date(user.created_at).toLocaleDateString()}
      </td>
    </tr>
  );
}
