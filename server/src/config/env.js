import dotenv from 'dotenv';
dotenv.config();

// Server configuration
export const PORT = process.env.PORT || '8000';

// Database configuration
export const DATABASE_URL = process.env.DATABASE_URL;

// JWT configuration
export const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1h';
export const JWT_SECRET = process.env.JWT_SECRET;
