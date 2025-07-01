import { Router } from "express";
import { getReservationsController } from "../controllers/reservations.controller.js";
import { validatePagination } from "../middlewares/validatePagination.js";
const reservationsRouter = Router();

reservationsRouter.get("/", validatePagination, getReservationsController);

export default reservationsRouter;
