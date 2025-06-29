import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reservationsRouter from "./routes/reservations.router.js";
import { PORT } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

/* Middlewares */
// CORS middleware to allow cross-origin requests
app.use(cors({ origin: "*" }));

// Body parser middleware
app.use(express.json());

app.use("/", reservationsRouter);

app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
