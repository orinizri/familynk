import { sendSuccess } from "../utils/apiResponse.js";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "../services/user.service.js";

export async function getProfileController(req, res, next) {
  const { userId } = req.user;
  try {
    const result = await getProfile(userId);
    return sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(req, res, next) {
  const { first_name, last_name, date_of_birth, photo_url } = req.body;
  const { id } = req.user;

  try {
    const result = await updateProfile(id, {
      first_name,
      last_name,
      date_of_birth,
      photo_url,
    });
    return sendSuccess(res, result.rows[0], "Profile updated");
  } catch (error) {
    next(error);
  }
}

export async function deleteProfileController(req, res, next) {
  const { id } = req.user;

  try {
    await deleteProfile(id);
    return sendSuccess(res, null, "Account deleted");
  } catch (error) {
    next(error);
  }
}
