import React, { memo } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ReservationRow from "./ReservationRow";
import ProductRow from "./ProductRow";
import { productsProps, reservationRowProps } from "@client/types/tree.types";

interface Props {
  reservation: reservationRowProps;
}

function ReservationAccordion({ reservation }: Props) {
  const { id, activePurchasesSum, activeChargesSum, products } = reservation;

  return (
    <Accordion>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <ReservationRow
          id={id}
          activePurchasesSum={activePurchasesSum}
          activeChargesSum={activeChargesSum}
        />
      </AccordionSummary>

      <AccordionDetails sx={{ p: 0, overflowX: "auto" }}>
        <TableContainer
          component={Paper}
          variant="outlined"
          sx={{ width: "100%", overflowX: "auto" }}
        >
          <Table
            size="small"
            sx={{
              tableLayout: "fixed", // enforce fixed layout
              width: "100%", // stretch to container width
              minWidth: 0, // prevents its own min-width from expanding
            }}
          >
            {/* define column widths: product 60%, status 20%, charge 20% */}
            <colgroup>
              <col style={{ width: "60%" }} />
              <col style={{ width: "20%" }} />
              <col style={{ width: "20%" }} />
            </colgroup>

            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="right">Charge</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p: productsProps) => (
                <ProductRow
                  id={p.id}
                  key={p.id}
                  name={p.name}
                  status={p.status}
                  charge={p.charge}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </AccordionDetails>
    </Accordion>
  );
}

export default memo(ReservationAccordion);
