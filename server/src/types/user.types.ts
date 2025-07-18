export interface RegisterUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO format string
  photo_url?: string;
  role?: "user" | "admin";
}

export interface User {
  id: number;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO format string
  photo_url?: string;
  role?: UserRoles;
}

export enum UserRoles {
  user = "user",
  admin = "admin",
}