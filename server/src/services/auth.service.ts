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
import { User } from "../types/user.types";
import { RegisterFormData } from "../types/auth.types";
import { issueVerificationToken } from "./email.service";
import { sendMail } from "../utils/mailer";
import { emailVerifyTemplate } from "../email/templates";
import { Person } from "@server/types/person.types";

/**
 * Auth service for user login, registration, and token refresh.
 * Handles user authentication and token generation.
 *
 * @module authService
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

    // If user not verified, return only user
    if (user && !user.email_verified) {
      return {
        user: {
          id: user.id,
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          date_of_birth: user.date_of_birth,
          photo_url: user.photo_url,
          role: user.role || "user",
          email_verified: user.email_verified || false,
        },
      };
    }

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
        email_verified: user.email_verified || false,
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

export async function registerUserService(
  data: RegisterFormData,
  meta?: { ip?: string | null; ua?: string | null }
) {
  const client = await pool.connect();
  const { email, password, first_name, last_name, date_of_birth, photo_url } =
    data;

  try {
    await client.query("BEGIN");

    // Check existing
    const existing = await client.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );
    if (existing.rows.length > 0) {
      return { message: "Email already registered" };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Step 1: Insert user
    const { rows: userRows } = await client.query(
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
    const user = userRows[0] as Partial<User>;

    // Step 2: Insert person for this user
    const { rows: personRows } = await client.query(
      `INSERT INTO persons (
        first_name, last_name, date_of_birth_from, created_by, user_id
      )
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id`,
      [
        first_name,
        last_name,
        date_of_birth || null, // from
        user.id,
        user.id,
      ]
    );
    const person = personRows[0] as Partial<Person>;

    // Step 3: Update user with person_id
    await client.query(`UPDATE users SET person_id = $1 WHERE id = $2`, [
      person.id,
      user.id,
    ]);

    // Step 4: Issue verification token
    const { link } = await issueVerificationToken({
      userId: user.id,
      purpose: "email_verify",
      ip: meta?.ip ?? null,
      ua: meta?.ua ?? null,
      tx: client,
    });

    await sendMail({
      to: email,
      subject: "Verify your email",
      html: emailVerifyTemplate(link),
    });

    await client.query("COMMIT");

    return {
      message: "User registered successfully. Please verify your email.",
      user: {
        id: user.id,
        email,
        first_name,
        last_name,
        date_of_birth,
        photo_url,
        email_verified: false,
        person_id: person.id,
      },
    };
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Unexpected error in register user:", error);
    throw new AppError("Failed to register user", 500);
  } finally {
    client.release();
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
    } as SignOptions);

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
        email_verified: user.email_verified,
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
