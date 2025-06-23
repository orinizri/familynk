import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import pool from "../db/db.js";
import {
  JWT_SECRET_REFRESH,
  JWT_SECRET_ACCESS,
  JWT_EXPIRES_IN_SHORT,
  JWT_EXPIRES_IN_LONG,
} from "../config/env.js";
import AppError from "../utils/appError.js";

export async function loginUserService(email, password) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password))) {
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

    const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, {
      expiresIn: JWT_EXPIRES_IN_SHORT,
    });
    const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, {
      expiresIn: JWT_EXPIRES_IN_LONG,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth,
        photo_url: user.photo_url,
      },
    };
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in login user:", error);
      throw new AppError("Failed to log in user", 500);
    }
    throw error;
  }
}

export async function registerUserService({
  email,
  password,
  first_name,
  last_name,
  date_of_birth,
  photo_url,
}) {
  try {
    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0)
      throw new AppError("Email already registered", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

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

    const payload = {
      userId: user.id,
      email,
      role: "user",
    };

    const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, {
      expiresIn: JWT_EXPIRES_IN_SHORT,
    });
    const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, {
      expiresIn: JWT_EXPIRES_IN_LONG,
    });

    return {
      accessToken,
      refreshToken,
      user: {
        id: user.id,
        email,
        first_name,
        last_name,
        date_of_birth,
        photo_url,
      },
    };
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in register user:", error);
      throw new AppError("Failed to register user", 500);
    }
    throw error;
  }
}

export async function refreshTokenService(refreshToken) {
  try {
    console.log("Received refresh token:", refreshToken);
    const payload = jwt.verify(refreshToken, JWT_SECRET_REFRESH);
    console.log("Decoded payload from refresh token:", payload);
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      payload.userId,
    ]);
    const user = result.rows[0];
    if (!user) throw new AppError("User not found", 404);

    const newPayload = {
      userId: user.id,
      email: user.email,
      role: user.role || "user",
    };

    const newAccessToken = jwt.sign(newPayload, JWT_SECRET_ACCESS, {
      expiresIn: JWT_EXPIRES_IN_LONG,
    });
    const newRefreshToken = jwt.sign(newPayload, JWT_SECRET_REFRESH, {
      expiresIn: JWT_EXPIRES_IN_SHORT,
    }); // 🆕 rotated

    return {
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
      user: {
        id: user.id,
        email: user.email,
        first_name: user.first_name,
        last_name: user.last_name,
        date_of_birth: user.date_of_birth,
        photo_url: user.photo_url,
      },
    };
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in refresh token:", error);
      throw new AppError("Failed to refresh token", 500);
    }
    throw error;
  }
}
