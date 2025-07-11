import React from "react";
import { useUsers } from "../../hooks/useUsers";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableRow from "./UsersTableRow";
import UsersTableFilters from "./UsersTableFilters";
import Spinner from "../Spinner/Spinner";
import PaginationControls from "./PaginationControls/PaginationControls";
import LimitSelector from "./LimitSelector/LimitSelector";
import styles from "./users_table.module.css";

export default function UsersTable() {
  const {
    data: users,
    filters,
    pagination,
    meta,
    loading,
    error,
    updateFilters,
    setLimit,
    setPage,
  } = useUsers();

  const handleSort = (field) => {
    const newOrder =
      filters.sortBy === field && filters.order === "asc" ? "desc" : "asc";
    updateFilters({ sortBy: field, order: newOrder });
  };

  return (
    <div className={styles.container}>
      {/* Filter + Limit */}
      <div className={styles.pagination_controls_container}>
        <UsersTableFilters filters={filters} updateFilters={updateFilters} />
        <LimitSelector limit={pagination.limit} onLimitChange={setLimit} />
      </div>

      {/* Table */}
      <div className={styles.table_container}>
        {loading ? (
          <Spinner message="Loading users..." />
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <table className={styles.table}>
            <UsersTableHeader
              sortBy={filters.sortBy}
              order={filters.order}
              onSort={handleSort}
            />
            <tbody className={styles.tbody}>
              {users.map((user) => (
                <UsersTableRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {meta && (
        <PaginationControls
          page={pagination.page}
          pageCount={meta.pageCount}
          onPageChange={setPage}
        />
      )}
    </div>
  );
}
