export interface UpdateProfileBody {
  first_name?: string;
  last_name?: string;
  date_of_birth?: Date;
  photo_url?: string;
}
export interface LoginRequestBody {
  email: string;
  password: string;
}
export interface RefreshRequestBody {
  refreshToken: string;
}
