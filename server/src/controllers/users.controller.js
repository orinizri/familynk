import { sendSuccess, sendError } from "../utilities/apiResponse.js";

export const getUsersController = (_req, res) => {
  try {
    const users = [
      { id: "1", name: "Ori" },
      { id: "2", name: "Alex" },
    ];
    return sendSuccess(res, users);
  } catch {
    return sendError(res, "Failed to fetch users", 500);
  }
};
