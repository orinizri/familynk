import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reservationsRouter from "./routes/reservations.router.js";
import { PORT } from "./config/env.js";
import errorHandler from "./middlewares/errorHandler.js";
import compression from "compression";
dotenv.config();

const app = express();

/* Middlewares */
// CORS middleware to allow cross-origin requests
app.use(cors({ origin: "*" }));
app.use(compression({ threshold: 0 })); // Compress all responses

// Body parser middleware
app.use(express.json());
app.use("/reservations", reservationsRouter);

// Error handling middleware
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}!`);
});
