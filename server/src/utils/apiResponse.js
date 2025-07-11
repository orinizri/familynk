// Utility functions for sending API responses
export function sendSuccess(res, data, status = 200) {
  return res.status(status).json({ success: true, data });
}

export function sendError(res, error, status = 400) {
  return res.status(status).json({ success: false, error });
}
