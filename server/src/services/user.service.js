import pool from "../db/db.js";
import AppError from "../utils/appError.js";

export async function getProfile(userId) {
  try {
    const result = await pool.query(
      `SELECT id, first_name, last_name, email, date_of_birth, photo_url, created_at, last_login, role
       FROM users WHERE id = $1`,
      [userId]
    );

    if (!result.rows.length) {
      throw new AppError("User not found", 404);
    }

    return result.rows[0];
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in getProfileService:", error);
      throw new AppError("Failed to fetch profile", 500);
    }
    throw error;
  }
}

// PATCH /me
export async function updateProfile(userId, body) {
  const { first_name, last_name, date_of_birth, photo_url } = body;

  try {
    const result = await pool.query(
      `UPDATE users
       SET first_name = $1, last_name = $2, date_of_birth = $3, photo_url = $4
       WHERE id = $5
       RETURNING id, email, first_name, last_name, date_of_birth, photo_url`,
      [first_name, last_name, date_of_birth, photo_url, userId]
    );

    if (!result.rows.length) {
      throw new AppError("Failed to update profile", 404);
    }

    return result.rows[0];
  } catch (error) {
    if (!(error instanceof AppError)) {
      console.error("Unexpected error in updateProfileService:", error);
      throw new AppError("Failed to update profile", 500);
    }
    throw error;
  }
}

export async function deleteProfile(userId) {
  try {
    const result = await pool.query("DELETE FROM users WHERE id = $1", [
      userId,
    ]);

    // Optional: Check rowCount to confirm deletion
    if (result.rowCount === 0) {
      throw new AppError("User not found", 404);
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
