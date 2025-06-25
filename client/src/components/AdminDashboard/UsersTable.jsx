import { useUsers } from "../../hooks/useUsers";
import UsersTableHeader from "./UsersTableHeader";
import UsersTableRow from "./UsersTableRow";
import UsersTableFilters from "./UsersTableFilters";
import Spinner from "../Spinner/Spinner";
import styles from "./users_table.module.css";

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
      <UsersTableFilters filters={filters} setFilters={setFilters} />
      <div className={styles.table_container}>
        {loading ? (
          <Spinner message="Loading users" />
        ) : (
          <table className={styles.table}>
            <UsersTableHeader
              currentSort={pagination.sortBy}
              currentOrder={pagination.order}
              setPagination={setPagination}
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
        <div
          style={{
            textAlign: "center",
            marginTop: "1rem",
          }}
        >
          Page {pagination.page} of {meta.pageCount}
          <button
            disabled={pagination.page === 1}
            onClick={() => setPagination((p) => ({ ...p, page: p.page - 1 }))}
          >
            Prev
          </button>
          <button
            disabled={pagination.page === meta.pageCount}
            onClick={() => setPagination((p) => ({ ...p, page: p.page + 1 }))}
          >
            Next
          </button>
        </div>
      )}
    </>
  );
}
