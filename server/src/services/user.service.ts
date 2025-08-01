import pool from "../db/db";
import AppError from "../utils/AppError";
import { UpdateUserInput, User } from "@server/types/user.types";

export async function getProfile(userId: string) {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, date_of_birth, photo_url, created_at, last_login, role
       FROM users WHERE id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      throw new AppError("Get Profile Failed", 404);
    }

    return result.rows[0] as User;
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in getProfileService:", error);
      throw new AppError("Failed to fetch profile", 500);
    }
    throw error;
  }
}


export async function updateUserService({
  id,
  first_name,
  last_name,
  date_of_birth,
  photo_url,
}: UpdateUserInput): Promise<User> {
  console.log("Entered updateUserService with data:", {
    id,
    first_name,
    last_name,
    date_of_birth,
    photo_url,
  });
  try {
    const existingUser = await pool.query("SELECT * FROM users WHERE id = $1", [
      id,
    ]);
    if (existingUser.rows.length === 0) {
      throw new AppError("User not found", 404);
    }

    const fields: string[] = [];
    const values: unknown[] = [];
    let paramIndex = 1;

    if (first_name !== undefined) {
      fields.push(`first_name = $${paramIndex++}`);
      values.push(first_name);
    }
    if (last_name !== undefined) {
      fields.push(`last_name = $${paramIndex++}`);
      values.push(last_name);
    }
    if (date_of_birth !== undefined) {
      fields.push(`date_of_birth = $${paramIndex++}`);
      values.push(date_of_birth);
    }
    if (photo_url !== undefined) {
      fields.push(`photo_url = $${paramIndex++}`);
      values.push(photo_url);
    }

    if (fields.length === 0) {
      throw new AppError("No fields provided for update", 400);
    }

    values.push(id); // Add user ID as the last parameter for the WHERE clause
    const query = `
      UPDATE users
      SET ${fields.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING id, email, first_name, last_name, date_of_birth, photo_url, role;
    `;

    const result = await pool.query(query, values);
    const updatedUser = result.rows[0] as User;

    return updatedUser;
  } catch (error) {
    console.error("Error in updateUserService:", error);
    if (!(error instanceof AppError)) {
      throw new AppError("Failed to update user", 500);
    }
    throw error;
  }
}

export async function deleteProfile(userId: string) {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);

    if (result.rowCount === 0) {
      throw new AppError("Delete Profile Failed", 404);
    }
    return;
  } catch (err) {
    if (!(err instanceof AppError)) {
      console.error("Unexpected error in deleteProfileService:", err);
      throw new AppError("Failed to delete account", 500);
    }
    throw err;
  }
}
