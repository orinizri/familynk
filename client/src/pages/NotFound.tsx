import React from "react";
import { Container, Typography } from "@mui/material";

export default function NotFound() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5">404 – Page Not Found</Typography>
    </Container>
  );
}
