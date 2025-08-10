export interface User {
  id: string;
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO format string
  photo_url?: string;
  role?: UserRoles;
  email_verified?: boolean;
  email_verified_at?: string; // ISO format string
}
export interface ReqUser {
  id: string;
  email: string;
  role?: UserRoles;
  iat: number; // issued at timestamp
  exp: number; // expiration timestamp
}

export enum UserRoles {
  user = "user",
  admin = "admin",
}

export interface UserOutput {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  date_of_birth: string;
  photo_url?: string;
}

export interface UpdateUserInput {
  id: string;
  first_name?: string;
  last_name?: string;
  date_of_birth?: string;
  photo_url?: string;
}
