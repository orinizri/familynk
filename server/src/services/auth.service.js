import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import { JWT_SECRET, JWT_EXPIRES_IN } from "../config/env.js";
import AppError from "../utils/appError.js";

export async function loginUser(email, password) {
  try {
    const query = "SELECT * FROM users WHERE email = $1";
    const values = [email];

    const result = await pool.query(query, values);
    const user = result.rows[0];

    if (!user) {
      throw new AppError("Invalid email or password", 401);
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      throw new AppError("Invalid email or password", 401);
    }

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    const payload = {
      userId: user.id,
      email: user.email,
      role: user.role || "user",
    };

    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "1h",
    });

    return token;
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in login user:", error);
      throw new AppError("Failed to log in user", 500);
    }
    throw error;
  }
}

export async function registerUser({
  email,
  password,
  first_name,
  last_name,
  date_of_birth,
  photo_url,
}) {
  try {
    // Check if user already exists
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0) {
      throw new AppError("Email already registered", 409);
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert the new user
    const result = await pool.query(
      `INSERT INTO users (email, password, first_name, last_name, date_of_birth, photo_url)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
      [
        email,
        hashedPassword,
        first_name,
        last_name,
        date_of_birth || null,
        photo_url || null,
      ]
    );

    const user = result.rows[0];

    // Create JWT payload
    const payload = {
      userId: user.id,
      email: email,
      name: `${first_name} ${last_name}`,
    };

    // Generate JWT token
    const token = jwt.sign(payload, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN || "1h",
    });

    return token;
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in register user:", error);
      throw new AppError("Failed to register user", 500);
    }
    throw error;
  }
}
