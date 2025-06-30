import React from "react";
import { TableRow, TableCell, useTheme } from "@mui/material";

export default function ProductRow({ name, status, charge }) {
  const theme = useTheme();
  const bgColor =
    status === "active"
      ? theme.palette.success.light
      : status === "cancelled"
      ? theme.palette.error.light
      : theme.palette.grey[200];

  return (
    <TableRow sx={{ bgcolor: bgColor }}>
      {/* Product name: multiline wrap / clamp */}
      <TableCell
        sx={{
          whiteSpace: "normal",
          wordBreak: "break-word",
          display: "-webkit-box",
          WebkitBoxOrient: "vertical",
          WebkitLineClamp: 2,
          overflow: "hidden",
        }}
      >
        {name}
      </TableCell>

      {/* Status: always render the cell, but only show text when not offeredOnly */}
      <TableCell
        align="center"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {status !== "offeredOnly" && status}
      </TableCell>

      {/* Charge: also */}
      <TableCell
        align="right"
        sx={{
          whiteSpace: "nowrap",
          overflow: "hidden",
          textOverflow: "ellipsis",
        }}
      >
        {status !== "offeredOnly" && `$${charge}`}
      </TableCell>
    </TableRow>
  );
}
