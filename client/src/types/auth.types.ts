import { User, UserRoles } from "./user.types";


export interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO format
  photo_url?: string;
  role?: UserRoles;
}
export interface LoginFormData {
  email: string;
  password: string;
}
export interface UserOutput {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  photo_url?: string;
  email_verified: boolean;
}

export interface AuthResponse {
  accessToken?: string;
  refreshToken?: string;
  user: User;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T | null;
}
