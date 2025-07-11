import dotenv from "dotenv";

dotenv.config();

// Server configuration
export const PORT = process.env.PORT || "8000";
export const NODE_ENV = process.env.NODE_ENV || "development";
export const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:3000";


// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL;
export const FAMILYNK_DATABASE_URL = process.env.FAMILYNK_DATABASE_URL;

// JWT configuration
export const JWT_EXPIRES_IN_SHORT = process.env.JWT_EXPIRES_IN_SHORT || "15m";
export const JWT_EXPIRES_IN_LONG = process.env.JWT_EXPIRES_IN_LONG || "7d";
export const JWT_SECRET_REFRESH = process.env.JWT_SECRET_REFRESH;
export const JWT_SECRET_ACCESS = process.env.JWT_SECRET_ACCESS;
