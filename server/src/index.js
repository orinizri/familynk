import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRouter from "./routes/users.router.js";
import { PORT } from "./config/env.js";

dotenv.config();

const app = express();

/* Middlewares */
// CORS middleware to allow cross-origin requests
app.use(cors());

// Body parser middleware
app.use(express.json());

app.get("/api/hello", (req, res) => {
  res.json({ message: "Hello from the backend!" });
});

app.use("/api/users", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
