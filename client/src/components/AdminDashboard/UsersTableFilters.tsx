import { useDebounce } from "../../hooks/useDebounce";
import { PaginationType } from "@client/types/pagination.types";
import React, { ChangeEvent, useEffect, useRef, useState } from "react";
import { TextField } from "@mui/material";

interface UsersTableFiltersProps {
  filters: Partial<PaginationType>;
  updateFilters: (newFilters: Partial<PaginationType>) => void;
}

export default function UsersTableFilters({
  filters,
  updateFilters,
}: UsersTableFiltersProps) {
  const [nameInput, setNameInput] = useState("");
  const debouncedName = useDebounce<string>(nameInput, 300);
  const nameRef = useRef(filters.name);

  useEffect(() => {
    const trimmedName = debouncedName.trim();
    if (trimmedName !== nameRef.current) {
      updateFilters({ name: trimmedName });
      nameRef.current = trimmedName;
    }
  }, [debouncedName, updateFilters]);

  const handleChange = (
    e: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | { name?: string; value: string }
    >
  ) => {
    const { name, value } = e.target;
    if (name === "name") {
      setNameInput(String(value));
    } else {
      updateFilters({ [name]: value });
    }
  };

  return (
    <>
      {/* Name Search */}
      <TextField
        name="name"
        label="Search by Name"
        value={nameInput}
        onChange={handleChange}
        slotProps={{ inputLabel: { shrink: true } }}
        size="small"
      />

      {/* Start Date */}
      <TextField
        name="startDate"
        label="From"
        type="date"
        size="small"
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.startDate || ""}
        onChange={handleChange}
      />

      {/* End Date */}
      <TextField
        name="endDate"
        label="To"
        type="date"
        size="small"
        slotProps={{ inputLabel: { shrink: true } }}
        value={filters.endDate || ""}
        onChange={handleChange}
      />
    </>
  );
}
