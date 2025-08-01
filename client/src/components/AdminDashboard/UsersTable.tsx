import React from "react";
import { useTrees } from "../../hooks/useTrees";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableRow, { UserRowData } from "./UsersTableRow";
import UsersTableFilters from "./UsersTableFilters";
import Spinner from "../Spinner/Spinner";
import PaginationControls from "./PaginationControls/PaginationControls";
import LimitSelector from "./LimitSelector/LimitSelector";
import styles from "./users_table.module.css";
import { SortOrder } from "@client/types/pagination.types";

export default function UsersTable() {
  const {
    data,
    filters,
    pagination,
    meta,
    loading,
    error,
    updateFilters,
    setLimit,
    setPage,
  } = useTrees();
  
  const handleSort = (field: keyof UserRowData, order: SortOrder): void => {
    updateFilters({ sortBy: field, order });
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
              {data.map((tree: UserRowData) => (
                <UsersTableRow key={tree.id} tree={tree} />
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
