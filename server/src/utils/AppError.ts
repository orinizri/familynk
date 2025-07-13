export default class AppError extends Error {
  statusCode: number;
  isOperational: boolean;
  constructor(message: string, statusCode: number = 500, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.name = "AppError";
    this.isOperational = isOperational;
    Object.setPrototypeOf(this, AppError.prototype);
  }
}
