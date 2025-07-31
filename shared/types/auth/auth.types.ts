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
