import React from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Stack,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTheme } from "@mui/material/styles";

export default function ReservationAccordion({ reservation }) {
  const theme = useTheme();
  const { reservationUuid, activePurchasesSum, activeChargesSum, products } =
    reservation;

  // Map status → background color
  const getRowBg = (status) => {
    switch (status) {
      case "active":
        return theme.palette.success.light;
      case "cancelled":
        return theme.palette.error.light;
      case "offeredOnly":
        return theme.palette.grey[200];
      default:
        return "inherit";
    }
  };

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          width="100%"
        >
          <Stack>
            <Typography variant="subtitle2" color="textSecondary">
              Reservation
            </Typography>
            <Typography variant="body1">{reservationUuid}</Typography>
          </Stack>

          <Stack alignItems="flex-end">
            <Typography variant="body2">
              Active Purchases: {activePurchasesSum}
            </Typography>
            <Typography variant="body2">
              Active Charges: ${activeChargesSum}
            </Typography>
          </Stack>
        </Stack>
      </AccordionSummary>

      <AccordionDetails>
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Charge</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {products.map((p) => (
                <TableRow key={p.id} sx={{ bgcolor: getRowBg(p.status) }}>
                  <TableCell>{p.name}</TableCell>
                  <TableCell>
                    {p.status === "offeredOnly" ? "Offered Only" : p.status}
                  </TableCell>
                  <TableCell align="right">
                    {p.status === "active" ? `$${p.charge}` : "—"}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}
