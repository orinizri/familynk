import * as React from "react";
import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Stack,
  Typography,
  Divider,
} from "@mui/material";

interface AuthLayoutProps {
  title: string;
  subtitle?: string;
  children: React.ReactNode; // your form fields/buttons
  footer?: React.ReactNode; // links or extra actions (e.g., “Have an account? Login”)
  maxWidth?: number; // px; default 700
  center?: boolean;
  dense?: boolean;
}

export function AuthLayout({
  title,
  subtitle,
  children,
  footer,
  maxWidth = 700,
  center = true,
  dense = false,
}: AuthLayoutProps) {
  return (
    <Box
      sx={{
        minHeight: center ? "100dvh" : undefined,
        display: center ? "grid" : "block",
        placeItems: center ? "center" : undefined,
      }}
    >
      <Card
        variant="outlined"
        sx={{
          width: "30dvw",
          maxWidth,
          borderRadius: 5,
          boxShadow: { md: 3 },
        }}
      >
        <CardHeader
          title={title}
          subheader={subtitle}
          sx={{ textAlign: "center", pb: 0 }}
        />
        <CardContent>
          <Stack spacing={dense ? 2 : 3} mt={1}>
            {children}
            {footer && (
              <>
                <Divider sx={{ my: dense ? 1 : 2 }} />
                <Typography
                  component="div"
                  variant="body2"
                  color="text.secondary"
                  textAlign="center"
                >
                  {footer}
                </Typography>
              </>
            )}
          </Stack>
        </CardContent>
      </Card>
    </Box>
  );
}
