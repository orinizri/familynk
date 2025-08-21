import { Button, Drawer } from "@mui/material";
import React, { ReactElement, useState } from "react";

interface ActionType {
  key: string;
  label: string;
  onClick: () => void;
}

const SideBar = ({
  content,
  actions,
}: {
  content: ReactElement;
  actions: ActionType[];
}) => {
  const [open, setOpen] = useState(false);

  const toggleDrawer = () => {
    setOpen(!open);
  };

  return (
    <>
      Ï{/* Sidebar */}
      <Drawer
        anchor="right"
        open={open}
        variant="temporary"
        slotProps={{ paper: { sx: { width: 300, padding: 2 } } }}
        onClose={toggleDrawer}
      >
        {/* <Typography variant="h6" gutterBottom>
          Add Person
        </Typography>

        <TextField fullWidth label="Name" sx={{ mb: 2 }} />

        <Divider sx={{ my: 2 }} /> */}

        {content}

        {actions.map((action: ActionType) => (
          <Button
            key={action.key}
            fullWidth
            variant="contained"
            color="primary"
            onClick={action.onClick}
          >
            {action.label}
          </Button>
        ))}
      </Drawer>
    </>
  );
};

export default SideBar;
