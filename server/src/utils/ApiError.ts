export interface FieldError {
  field: string;
  message: string;
}

export class ApiError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
    public readonly errors?: FieldError[],
  ) {
    super(message);
    this.name = 'ApiError';
  }

  static badRequest = (message: string, errors?: FieldError[]) =>
    new ApiError(400, message, errors);
  static unauthorized = (message = 'Authentication required') => new ApiError(401, message);
  static forbidden = (message = 'You do not have permission to perform this action') =>
    new ApiError(403, message);
  static notFound = (message = 'Resource not found') => new ApiError(404, message);
  static conflict = (message: string) => new ApiError(409, message);
  static unavailable = (message = 'Service temporarily unavailable') => new ApiError(503, message);
}
