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
import { Box, Paper, TableContainer, Table, TableBody } from "@mui/material";

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
      <Box
        display="flex"
        justifyContent="space-around"
        flexWrap="wrap"
        alignItems="center"
        mt={2}
        gap={2}
      >
        <UsersTableFilters filters={filters} updateFilters={updateFilters} />
        <LimitSelector limit={pagination.limit} onLimitChange={setLimit} />
      </Box>

      {/* Table */}
      <div className={styles.table_container}>
        {loading ? (
          <Spinner message="Loading users..." />
        ) : error ? (
          <div className={styles.error}>{error}</div>
        ) : (
          <Box sx={{ maxWidth: 960, margin: "2rem auto", px: 2 }}>
          <TableContainer component={Paper} elevation={3}>
            <Table className={styles.table}>
              <UsersTableHeader
                sortBy={filters.sortBy}
                order={filters.order}
                onSort={handleSort}
              />
              <TableBody className={styles.tbody}>
                {data.map((tree: UserRowData) => (
                  <UsersTableRow key={tree.id} tree={tree} />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
          </Box>
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
