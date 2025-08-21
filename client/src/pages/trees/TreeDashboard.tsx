import React from "react";
import TreesTable from "../../components/Table/TreesTable";
import { Button, Paper } from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import { useNavigate } from "react-router-dom";

export default function TreesDashboard() {
  const navigate = useNavigate();

  return (
    <Paper
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      elevation={0}
    >
      <h2 style={{ textAlign: "center" }}>My Trees</h2>
      <Button
        variant="text"
        size="small"
        startIcon={<AddBoxIcon />}
        onClick={() => navigate("/edit-tree")}
        sx={{ color: "primary.main",fontSize: "1rem" ,textTransform: "none", alignSelf: "flex-start", marginLeft: 2 }}
      >
        Add a New Tree
      </Button>
      <TreesTable />
    </Paper>
  );
}
