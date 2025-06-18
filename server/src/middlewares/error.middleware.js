import AppError from '../utils/appError.js';

export function errorMiddleware(err, req, res, next) {
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    err instanceof AppError ? err.message : 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
  });
}
