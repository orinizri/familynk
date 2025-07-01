import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reservationsRouter from "./routes/reservations.router.js";
import { CLIENT_URL, PORT } from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js";
import compression from "compression";
import healthRouter from "./routes/health.router.js";
dotenv.config();

const app = express();
/* Middlewares */
// CORS middleware to allow cross-origin requests
app.use(cors({ origin: CLIENT_URL }));
app.use(compression({ threshold: 0 })); // Compress all responses

// Body parser middleware
app.use(express.json());

// Health-check router
app.use("/healthz", healthRouter);

// Reservations router
app.use("/reservations", reservationsRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
