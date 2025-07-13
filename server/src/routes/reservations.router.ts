import { Router } from "express";
import { getReservationsController } from "../controllers/reservations.controller.ts";
import { validatePagination } from "../middlewares/validatePagination.ts";
const reservationsRouter = Router();

reservationsRouter.get("/", validatePagination, getReservationsController);

export default reservationsRouter;
