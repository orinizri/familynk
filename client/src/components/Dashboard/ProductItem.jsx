import React from "react";
import { Stack, Typography } from "@mui/material";
import StatusBadge from "../StatusBadge";

export default function ProductItem({ product }) {
  const { name, status, charge } = product;

  return (
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography>{name}</Typography>
      <Stack direction="row" alignItems="center" spacing={1}>
        <StatusBadge status={status} />
        {status === "active" && (
          <Typography variant="body2">${charge}</Typography>
        )}
      </Stack>
    </Stack>
  );
}
