import { sendSuccess } from "../utils/apiResponse";
import {
  deleteProfile,
  getProfile,
  updateUserService,
} from "../services/user.service";
import { Request, Response, NextFunction } from "express";
import { updateUserSchema } from "../schemas/user.schema";

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
    return next(error);
  }
}

export async function updateProfileController(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { id } = req.user;
  try {
    const parsed = updateUserSchema.parse(req.body);
    const result = await updateUserService({
      id,
      ...parsed,
    });
    sendSuccess(res, result);
  } catch (error) {
    return next(error);
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
    return next(error);
  }
}
