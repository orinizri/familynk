import React from "react";
import { AdminUsersTableLimitOptions } from "../../../utils/constants";
import "./limit_selector.css";

export default function LimitSelector({
  limit,
  onLimitChange,
  options = AdminUsersTableLimitOptions,
  className = "",
}) {
  return (
    <div className={`limit-selector ${className}`}>
      <label htmlFor="limit" style={{ marginRight: "0.5rem" }}>
        Results per page:
      </label>
      <select
        id="limit"
        value={limit}
        onChange={(e) => onLimitChange(Number(e.target.value))}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
