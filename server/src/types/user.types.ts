export interface RegisterUserInput {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
  date_of_birth: string; // ISO format string
  photo_url?: string;
  role?: "user" | "admin";
}

export interface UpdateProfileBody {
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  photo_url?: string;
};