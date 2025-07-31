import React, { ChangeEvent } from "react";
import { AdminUsersTableLimitOptions } from "../../../utils/constants";
import "./limit_selector.css";

interface LimitSelectorProps {
  limit: number;
  onLimitChange: (limit: number) => void;
  options?: number[];
  className?: string;
}

export default function LimitSelector({
  limit,
  onLimitChange,
  options = AdminUsersTableLimitOptions,
  className = "",
}: LimitSelectorProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onLimitChange(Number(e.target.value));
  };

  return (
    <div className={`limit-selector ${className}`}>
      <label htmlFor="limit" style={{ marginRight: "0.5rem" }}>
        Results per page:
      </label>
      <select id="limit" value={limit} onChange={handleChange}>
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
    </div>
  );
}
