
export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
}

export interface AddressModel {
  addressLine1: string;
  addressLine2: string;
  city: string;
  state: string;
  country: string;
  pinCode: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  contactNumber: string;
  gender: number;
  address: AddressModel;
  dateofBirth: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}
