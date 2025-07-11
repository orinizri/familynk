import React from "react";
import { Stack, Typography, Paper, useTheme } from "@mui/material";

export default function ReservationRow({
  reservationUuid,
  activePurchasesSum,
  activeChargesSum,
}) {
  const theme = useTheme();

  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        minWidth: 0,
        backgroundColor: theme.palette.background.paper,
        px: 1,
        py: 1,
        boxSizing: "border-box",
      }}
    >
      <Stack
        direction={{ xs: "column", sm: "row" }}
        spacing={{ xs: 1, sm: 2 }}
        alignItems="center"
        sx={{ width: "100%" }}
      >
        {/* UUID */}
        <Typography
          variant="body2"
          sx={{
            flex: { sm: 1 },
            minWidth: 0,
            // mobile: allow wrap; desktop: single-line ellipsis
            whiteSpace: { xs: "normal", sm: "nowrap" },
            overflow: { xs: "visible", sm: "hidden" },
            textOverflow: { xs: "clip", sm: "ellipsis" },
          }}
        >
          {reservationUuid}
        </Typography>

        {/* Purchases */}
        <Typography
          variant="body2"
          sx={{
            flex: { sm: 1.5 },
            minWidth: 0,
            textAlign: { xs: "left", sm: "center" },
            whiteSpace: { xs: "normal", sm: "nowrap" },
            overflow: { xs: "visible", sm: "hidden" },
            textOverflow: { xs: "clip", sm: "ellipsis" },
          }}
        >
          {activePurchasesSum}
        </Typography>

        {/* Charges */}
        <Typography
          variant="body2"
          sx={{
            flex: { sm: 1 },
            minWidth: 0,
            textAlign: { xs: "left", sm: "center" },
            whiteSpace: { xs: "normal", sm: "nowrap" },
            overflow: { xs: "visible", sm: "hidden" },
            textOverflow: { xs: "clip", sm: "ellipsis" },
          }}
        >
          ${activeChargesSum}
        </Typography>
      </Stack>
    </Paper>
  );
}
