import React, { ChangeEvent } from "react";
import {
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  SelectChangeEvent,
} from "@mui/material";
import { TableLimitOptions } from "../../../utils/constants";

interface LimitSelectorProps {
  limit: number;
  onLimitChange: (limit: number) => void;
  options?: number[];
  className?: string;
}

export default function LimitSelector({
  limit,
  onLimitChange,
  options = TableLimitOptions,
  className = "",
}: LimitSelectorProps) {
  const handleChange = (e: SelectChangeEvent<string>) => {
    const value = parseInt(e.target.value, 10);
    onLimitChange(value);
  };

  return (
    <FormControl
      variant="outlined"
      size="small"
      className={className}
      sx={{ minWidth: 160 }}
    >
      <InputLabel id="limit-label">Results per page</InputLabel>
      <Select
        labelId="limit-label"
        id="limit"
        value={limit.toString()}
        label="Results per page"
        onChange={handleChange}
      >
        {options.map((opt) => (
          <MenuItem key={opt} value={opt}>
            {opt}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
