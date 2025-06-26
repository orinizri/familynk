import { useUsers } from "../../hooks/useUsers";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableRow from "./UsersTableRow";
import UsersTableFilters from "./UsersTableFilters";
import Spinner from "../Spinner/Spinner";
import styles from "./users_table.module.css";
import PaginationControls from "./PaginationControls/PaginationControls";
import LimitSelector from "./LimitSelector/LimitSelector";

export default function UsersTable() {
  const {
    users,
    loading,
    filters,
    pagination,
    meta,
    setFilters,
    setPagination,
  } = useUsers();

  return (
    <>
      <div className={styles.pagination_controls_container}>
        <UsersTableFilters filters={filters} setFilters={setFilters} />
        <LimitSelector
          limit={pagination.limit}
          onLimitChange={(newLimit) =>
            setPagination((prev) => ({
              ...prev,
              page: 1,
              limit: newLimit,
            }))
          }
        />
      </div>
      <div className={styles.table_container}>
        {loading ? (
          <Spinner message="Loading users" />
        ) : (
          <table className={styles.table}>
            <UsersTableHeader
              sortBy={filters.sortBy}
              order={filters.order}
              setPagination={setPagination}
              onSort={(sortBy, order) =>
                setFilters((p) => ({ ...p, sortBy, order }))
              }
            />
            <tbody className={styles.tbody}>
              {users.map((user) => (
                <UsersTableRow key={user.id} user={user} />
              ))}
            </tbody>
          </table>
        )}
      </div>

      {meta && (
        <PaginationControls
          page={pagination.page}
          pageCount={meta.pageCount}
          onPageChange={(newPage) =>
            setPagination((prev) => ({ ...prev, page: newPage }))
          }
        />
      )}
    </>
  );
}
