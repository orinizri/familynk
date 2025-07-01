import dotenv from "dotenv";

dotenv.config();

export const PORT = process.env.PORT || "8000";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";
