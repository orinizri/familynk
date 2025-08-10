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

// Crypto configuration
export const CRYPTO_RANDOM_BITS: number = parseInt(
  process.env.CRYPTO_RANDOM_BITS,
  10
);
export const CRYPTO_HASH_TYPE: string = process.env.CRYPTO_HASH_TYPE;

// Mailer configuration
export const SMTP_URL: string = process.env.SMTP_URL;
export const MAIL_FROM: string = process.env.MAIL_FROM;
export const EMAIL_VERIFY_TTL_HOURS: number =
  parseInt(process.env.EMAIL_VERIFY_TTL_HOURS) || 24;
export const VERIFY_BASE_URL: string =
  process.env.VERIFY_BASE_URL || "http://localhost:8000";
