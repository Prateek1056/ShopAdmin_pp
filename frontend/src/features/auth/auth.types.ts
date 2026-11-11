
export interface LoginRequest {
  email: string;
  password: string;
}

export interface CurrentUserDto {
  userId: string;
  userName: string;
}

export interface ApiError {
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  errors: ApiError[];
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
