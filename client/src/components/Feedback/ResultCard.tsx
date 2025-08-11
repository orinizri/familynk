// src/components/Feedback/ResultCard.tsx
import * as React from "react";
import { Card, CardContent, CardHeader, Stack } from "@mui/material";

interface ResultCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children?: React.ReactNode; // extra content (e.g., details)
}

export function ResultCard({
  title,
  subtitle,
  action,
  children,
}: ResultCardProps) {
  return (
    <Card
      variant="outlined"
      sx={{ maxWidth: 520, mx: "auto", borderRadius: 3, boxShadow: { md: 2 } }}
    >
      <CardHeader
        title={title}
        subheader={subtitle}
        sx={{ textAlign: "center", pb: 0 }}
      />
      <CardContent>
        <Stack spacing={2} alignItems="center" textAlign="center">
          {children}
          {action && (
            <Stack direction="row" spacing={1}>
              {action}
            </Stack>
          )}
        </Stack>
      </CardContent>
    </Card>
  );
}
