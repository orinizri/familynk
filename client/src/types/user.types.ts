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
}

export enum UserRoles {
  user = "user",
  admin = "admin",
}
