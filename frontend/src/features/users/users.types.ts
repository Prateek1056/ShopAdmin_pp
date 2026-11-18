
// Gender values from backend
export const Gender = {
  Undefined: 0,
  Male: 1,
  Female: 2,
} as const;

export type Gender = (typeof Gender)[keyof typeof Gender];

// User roles from backend
export const UserRole = {
  User: 1,
  Admin: 2,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Address structure
export interface AddressDto {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

// User information returned by GetAll and GetById
export interface UserDto {
  id: string;
  name: string;
  email: string;
  phone: string;
  gender: Gender;
  address: AddressDto;
  dateofBirth: string;
  role: UserRole;
  isActive: boolean;
}

// Request body for creating and updating users
export interface SaveUserRequest {
  id?: string;
  name: string;
  email: string;
  contactNumber: string;
  password: string;
  gender: Gender;
  address: AddressDto;
  dateofBirth: string;
  role: UserRole;
}

// Request body for deleting a user
export interface DeleteUserRequest {
  id: string;
}

// API error structure
export interface ApiError {
  message: string;
}

// Generic API response
export interface ApiResponse<T> {
  success: boolean;
  message: string | null;
  data: T;
  errors: ApiError[];
}