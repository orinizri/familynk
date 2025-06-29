import { Router } from "express";
import { getReservationsController } from "../controllers/reservations.controller.js";

const reservationsRouter = Router();

reservationsRouter.get("/", getReservationsController);

export default reservationsRouter;
