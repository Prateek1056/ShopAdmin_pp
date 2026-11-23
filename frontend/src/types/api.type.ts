
export interface ApiErrorItem {
  message: string;
}

export interface ApiResponse<T = null> {
  success: boolean;
  message: string;
  data: T | null;
  errors?: ApiErrorItem[] | null;
}

export class ApiError extends Error {
  public statusCode: number;

  public errors: ApiErrorItem[] | null;

  constructor(
    message: string,
    statusCode: number,
    errors?: ApiErrorItem[] | null,
  ) {
    super(message);

    this.name = "ApiError";
    this.statusCode = statusCode;
    this.errors = errors ?? null;
  }
}
