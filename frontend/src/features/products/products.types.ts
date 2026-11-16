
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stockQuantity: number;
  isActive: boolean;
  imageUrl: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errors: {
    message: string;
  }[];
}
