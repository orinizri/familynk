import { UserOutput } from "./user.types";

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: UserOutput;
}

export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  error?: string;
  data?: T | null;
}

export interface RegisterFormData {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO format
  photo_url?: string;
  role?: "user" | "admin";
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface RefreshRequestBody {
  refreshToken: string;
}
