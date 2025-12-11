export interface User {
  user_id: number;
  username: string;
  email: string;
  role: 'Customer' | 'Specialist' | 'Seller';
}

export interface AuthResponse {
  message: string;
  user: User;
  specialist?: {
    specialist_id: number;
    shop_name: string;
  };
}

export interface Element {
  element_id: number;
  element_name: string;
  description: string;
}