import React, { ReactNode } from "react";
import { Typography, TextField, Card, CardContent, Stack } from "@mui/material";

interface ProfileFieldProps {
  label: string;
  name?: string;
  value: string | ReactNode;
  type?: string;
  editing?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function InputField({
  label,
  name,
  value,
  type = "text",
  editing = false,
  onChange,
}: ProfileFieldProps) {
  return (
    <Card variant="outlined" sx={{ mb: 2 }}>
      <CardContent>
        <Stack spacing={1}>
          <Typography variant="subtitle2" color="text.secondary">
            {label}
          </Typography>

          {editing ? (
            <TextField
              name={name}
              type={type}
              value={value}
              size="small"
              onChange={onChange}
              fullWidth
            />
          ) : (
            <Typography variant="body1">{value || "—"}</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
