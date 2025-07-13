export interface AuthTokens {
    access_token: string;
    refresh_token: string;
  }
  
  export interface UserOutput {
    id: string;
    email: string;
    first_name: string;
    last_name: string;
    date_of_birth: string;
    photo_url?: string;
  }
  
  export interface AuthResponse {
    access_token: string;
    refresh_token: string;
    user: UserOutput;
  }