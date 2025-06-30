import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import reservationsRouter from "./routes/reservations.router.js";
import { PORT } from "./config/env.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { checkDbConnection } from "../src/db/pool.js";

dotenv.config();

const app = express();

/* Middlewares */
// CORS middleware to allow cross-origin requests
app.use(cors({ origin: "*" }));

// Body parser middleware
app.use(express.json());
app.use("/reservations", reservationsRouter);

// Error handling middleware
app.use(errorHandler);
checkDbConnection()
  .then(() => console.log("✅ Database connection established"))
  .catch((err) => console.error("❌ Database connection failed", err));
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
