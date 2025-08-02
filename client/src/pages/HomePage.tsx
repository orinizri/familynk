import React from "react";
import { useAuth } from "../contexts/authContext";
import { Box, Typography, Container } from "@mui/material";

export default function HomePage() {
  const { user } = useAuth();

  return (
    <Container maxWidth="sm">
      <Box sx={{ padding: 4, textAlign: "center" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome{user.first_name} {user.last_name}!
        </Typography>
      </Box>
    </Container>
  );
}
