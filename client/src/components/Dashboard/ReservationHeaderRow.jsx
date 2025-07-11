import React, { memo } from "react";
import { Stack, Typography, useTheme } from "@mui/material";
import { RESERVATION_HEADERS } from "../../constants/reservationHeaders";

function ReservationHeaderRow() {
  const theme = useTheme();

  return (
    <Stack
      direction="row"
      spacing={2}
      sx={{
        pl: 2,
        pr: 2,
        py: 1,
        backgroundColor: theme.palette.grey[200],
        borderBottom: `1px solid ${theme.palette.divider}`,
        position: "sticky",
        top: 0,
        zIndex: theme.zIndex.appBar,
      }}
    >
      {RESERVATION_HEADERS.map(({ key, label, flex = 1, align = "left" }) => (
        <Typography
          key={key}
          variant="caption"
          flex={flex}
          textAlign={align}
          color="textSecondary"
          noWrap
        >
          {label}
        </Typography>
      ))}
    </Stack>
  );
}
export default memo(ReservationHeaderRow);
