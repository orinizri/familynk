import React from "react";
import { Container, Typography } from "@mui/material";
import DashboardPage from "../components/Dashboard/DashboardPage";

export default function Dashboard() {
  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Reservations Dashboard
      </Typography>
      <DashboardPage />
    </Container>
  );
}
