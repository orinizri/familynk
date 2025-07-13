import AppError from '../utils/AppError.js';

export function errorMiddleware(err, _req, res, _next) {
  console.error(err);

  const status = err.statusCode || 500;
  const message =
    err instanceof AppError ? err.message : 'Internal server error';

  res.status(status).json({
    success: false,
    error: message,
  });
}
