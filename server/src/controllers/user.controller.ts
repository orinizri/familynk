import { sendSuccess } from "../utils/apiResponse";
import {
  deleteProfile,
  getProfile,
  updateProfile,
} from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { UpdateProfileBody } from "@server/types/auth.types";

export async function getProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  try {
    const result = await getProfile(id);
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { first_name, last_name, date_of_birth, photo_url } =
    req.body as UpdateProfileBody;
  const { id } = req.user;

  try {
    const result = await updateProfile(id, {
      first_name,
      last_name,
      date_of_birth,
      photo_url,
    });
    sendSuccess(res, result);
  } catch (error) {
    next(error);
  }
}

export async function deleteProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;

  try {
    await deleteProfile(id);
    sendSuccess(res, null);
  } catch (error) {
    next(error);
  }
}
