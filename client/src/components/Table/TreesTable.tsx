import React from "react";
import { useTrees } from "../../hooks/useTrees";
import TableHeaders from "./TableHeaders";
import TreesTableRow, { UserRowData } from "./TreeTableRow";
import TableFilters from "./TableFilters";
import Spinner from "../Spinner/Spinner";
import PaginationControls from "./PaginationControls/PaginationControls";
import LimitSelector from "./LimitSelector/LimitSelector";
import { SortOrder } from "@client/types/pagination.types";
import { Box, Paper, TableContainer, Table, TableBody } from "@mui/material";

export default function TreesTable() {
  const {
    data,
    filters,
    pagination,
    meta,
    isTablePending,
    isTableError,
    updateFilters,
    setLimit,
    setPage,
  } = useTrees();

  const handleSort = (field: keyof UserRowData, order: SortOrder): void => {
    updateFilters({ sortBy: field, order });
  };

  return (
    <div>
      {/* Filter + Limit */}
      <Box
        display="flex"
        justifyContent="space-around"
        flexWrap="wrap"
        alignItems="center"
        mt={2}
        gap={2}
      >
        <TableFilters filters={filters} updateFilters={updateFilters} />
        <LimitSelector limit={pagination.limit} onLimitChange={setLimit} />
      </Box>

      {/* Table */}
      <div>
        {isTablePending ? (
          // Show spinner while loading
          <Spinner message="Loading users..." />
        ) : isTableError ? (
          // Show error message if loading failed
          <div>Loading user failed</div>
        ) : (
          // Show table if data is successfully loaded
          <Box sx={{ maxWidth: 960, margin: "2rem auto", px: 2 }}>
            <TableContainer
              component={Paper}
              elevation={3}
              sx={{
                maxWidth: "960px",
                margin: "2rem auto",
                overflowX: "auto",
                borderRadius: 2,
                boxShadow: 3,
              }}
            >
              <Table>
                <TableHeaders
                  sortBy={filters.sortBy}
                  order={filters.order}
                  onSort={handleSort}
                />
                <TableBody>
                  {data.map((tree: UserRowData) => (
                    <TreesTableRow key={tree.id} tree={tree} />
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
