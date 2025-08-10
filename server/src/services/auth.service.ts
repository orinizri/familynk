import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import pool from "../db/db";
import {
  JWT_SECRET_REFRESH,
  JWT_SECRET_ACCESS,
  JWT_EXPIRES_IN_SHORT,
  JWT_EXPIRES_IN_LONG,
} from "../config/env";
import AppError from "../utils/AppError";
import { User } from "@server/types/user.types";
import { RegisterFormData } from "@server/types/auth.types";
import { issueVerificationToken } from "./token.service";
import { sendMail } from "@server/utils/mailer";
import { emailVerifyTemplate } from "@server/email/templates";

/**
 * Auth service for user login, registration, and token refresh.
 * Handles user authentication and token generation.
 *
 * @module authService
 */

/**
 * Logs in a user by validating credentials and generating JWT tokens.
 * @async
 * @param {string} email - User's email address.
 * @param {string} password - User's password.
 * @return {Promise<Object>} An object containing access token, refresh token, and user details.
 * @throws {AppError} If user not found or password does not match.
 */
export async function loginUserService(email: string, password: string) {
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    const user = result.rows[0] as User;

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new AppError("Login Failed", 404);
    }

    await pool.query("UPDATE users SET last_login = NOW() WHERE id = $1", [
      user.id,
    ]);

    const payload = {
      id: user.id,
      email: user.email,
      role: user.role || "user",
    };
    if (!JWT_SECRET_ACCESS) {
      throw new Error("JWT_SECRET_ACCESS is not defined");
    }

    const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, {
      expiresIn: JWT_EXPIRES_IN_SHORT,
    } as SignOptions);
    const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, {
      expiresIn: JWT_EXPIRES_IN_LONG,
    } as SignOptions);

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
        role: user.role || "user",
      },
    };
  } catch (error) {
    console.error("Unexpected error in login user:", error);
    if (!(error instanceof AppError)) {
      throw new AppError("Failed to log in user", 500);
    }
    throw error;
  }
}

/**
 * Registers a new user and generates JWT tokens.
 * @async
 * @param {Object} userData - User registration data.
 * @param {string} userData.email - User's email address.
 * @param {string} userData.password - User's password.
 * @param {string} userData.first_name - User's first name.
 * @param {string} userData.last_name - User's last name.
 * @param {string} [userData.date_of_birth] - User's date of birth (optional).
 * @param {string} [userData.photo_url] - URL of user's photo (optional).
 * @param {string} [userData.role] - User's role (optional, defaults to "user").
 * @return {Promise<Object>} An object containing access token, refresh token, and user details.
 * @throws {AppError} If email already registered or registration fails.
 */
export async function registerUserService(
  data: RegisterFormData,
  meta?: { ip?: string | null; ua?: string | null }
) {
  const client = await pool.connect();
  const { email, password, first_name, last_name, date_of_birth, photo_url } =
    data;
  try {
    await client.query("BEGIN");

    const existing = await pool.query("SELECT id FROM users WHERE email = $1", [
      email,
    ]);
    if (existing.rows.length > 0)
      throw new AppError("Email already registered", 409);

    const hashedPassword = await bcrypt.hash(password, 10);

    const { rows } = await pool.query(
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

    const user = rows[0] as User;

    // const payload = {
    //   id: user.id,
    //   email,
    //   role,
    // };

    // const accessToken = jwt.sign(payload, JWT_SECRET_ACCESS, {
    //   expiresIn: JWT_EXPIRES_IN_SHORT,
    // } as SignOptions);
    // const refreshToken = jwt.sign(payload, JWT_SECRET_REFRESH, {
    //   expiresIn: JWT_EXPIRES_IN_LONG,
    // } as SignOptions);

    const { link } = await issueVerificationToken({
      userId: user.id,
      purpose: "email_verify",
      ip: meta?.ip ?? null,
      ua: meta?.ua ?? null,
      tx: client,
    });
    console.log("Verification link:", link);

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: emailVerifyTemplate(link),
    });
    console.log("sent verification email to:", email);

    await client.query("COMMIT");

    return {
      message: "User registered successfully. Please verify your email.",
      user: {
        id: user.id,
        email: email,
        first_name: first_name,
        last_name: last_name,
        date_of_birth: date_of_birth,
        photo_url: photo_url,
        email_verified: false, // Initially false until verified
      },
    };
  } catch (error) {
    console.error("Error in refreshTokenService:", error);
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in register user:", error);
      throw new AppError("Failed to register user", 500);
    }
    throw error;
  }
}

/**
 * Refreshes JWT tokens using a valid refresh token.
 * @async
 * @param {string} refreshToken - The refresh token to validate and use for generating new tokens.
 * @return {Promise<Object>} An object containing new access token, new refresh token, and user details.
 * @throws {AppError} If refresh token is invalid or user not found.
 * */
export async function refreshTokenService(refreshToken: string) {
  try {
    const payload = jwt.verify(
      refreshToken,
      JWT_SECRET_REFRESH
    ) as jwt.JwtPayload;
    const result = await pool.query("SELECT * FROM users WHERE id = $1", [
      payload.id,
    ]);

    const user = result.rows[0] as User;
    if (!user) throw new AppError("Login Failed", 404);

    const newPayload = {
      id: user.id,
      email: user.email,
      role: user.role || "user",
    };
    const newAccessToken = jwt.sign(newPayload, JWT_SECRET_ACCESS, {
      expiresIn: JWT_EXPIRES_IN_LONG,
    } as SignOptions);
    const newRefreshToken = jwt.sign(newPayload, JWT_SECRET_REFRESH, {
      expiresIn: JWT_EXPIRES_IN_SHORT,
    } as SignOptions); // 🆕 rotated

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
        role: user.role || "user",
      },
    };
  } catch (error) {
    console.error("Error in refreshTokenService:", error);
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in refresh token:", error);
      throw new AppError("Failed to refresh token", 500);
    }
    throw error;
  }
}