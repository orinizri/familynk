import dotenv from "dotenv";

dotenv.config();

// Server configuration
export const PORT: string = process.env.PORT || "8000";
export const NODE_ENV: string = process.env.NODE_ENV || "development";
export const CLIENT_URL: string =
  process.env.CLIENT_URL || "http://localhost:3000";

// Database configuration
export const DATABASE_URL: string = process.env.DATABASE_URL;
export const FAMILYNK_DATABASE_URL: string = process.env.FAMILYNK_DATABASE_URL;

// JWT configuration
export const JWT_EXPIRES_IN_SHORT: string =
  process.env.JWT_EXPIRES_IN_SHORT ?? "15m";
export const JWT_EXPIRES_IN_LONG: string =
  process.env.JWT_EXPIRES_IN_LONG ?? "7d";
export const JWT_SECRET_REFRESH: string = process.env.JWT_SECRET_REFRESH;
export const JWT_SECRET_ACCESS: string = process.env.JWT_SECRET_ACCESS;
