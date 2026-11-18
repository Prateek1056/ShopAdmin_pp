export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: Record<string, string> | null;
}

export class ApiError extends Error {
  public statusCode: number;
  public errors: Record<string, string> | null;

  constructor(
    message: string,
    statusCode: number,
    errors?: Record<string, string> | null,
  ) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors ?? null;
  }
}
