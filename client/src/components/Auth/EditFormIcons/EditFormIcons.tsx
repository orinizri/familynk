import React, { FunctionComponent } from "react";
import { IconButton, Tooltip } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";

interface EditFormIconsProps {
  isEditing: boolean;
  setIsEditing: (editing: boolean) => void;
  onSave: () => void;
}

const EditFormIcons: FunctionComponent<EditFormIconsProps> = ({
  isEditing,
  setIsEditing,
  onSave,
}) => {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "flex-end",
        flexDirection: "row",
        margin: "1rem",
      }}
    >
      {isEditing ? (
        <Tooltip title="Save changes">
          <IconButton
            onClick={() => void onSave()}
            color="default"
            size="small"
            aria-label="Save profile changes"
          >
            <SaveIcon />
          </IconButton>
        </Tooltip>
      ) : (
        <Tooltip title="Edit profile">
          <IconButton
            onClick={() => setIsEditing(true)}
            color="default"
            size="small"
            aria-label="Edit profile"
          >
            <EditIcon />
          </IconButton>
        </Tooltip>
      )}
    </div>
  );
};

export default EditFormIcons;
