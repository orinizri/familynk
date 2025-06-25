import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { errorMiddleware } from "./middlewares/error.middleware.js";
import userRouter from "./routes/user.router.js";
import authRouter from "./routes/auth.router.js";
import adminRouter from "./routes/admin.router.js";
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
app.use("/user", userRouter);
app.use("/auth", authRouter);
app.use("/admin", adminRouter);

// Error handling middleware
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.info(`Server running on http://localhost:${PORT}`);
});
