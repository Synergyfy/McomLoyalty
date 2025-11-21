
export interface AdminLoginDto {
  email: string;
  password: string;
}

export interface AdminLoginResponse {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    role: string;
  };
}

export interface RefreshTokenResponse {
  user: {
    name: string;
    role: string;
  };
  access_token: string;
  refresh_token: string;
}

// Participant Types
export interface ParticipantLoginDto {
  email: string;
  password: string;
}

export interface ParticipantSignupDto {
  fullName: string;
  email: string;
  password: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  location?: string;
}

export interface ParticipantAuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    fullName: string;
    role: string;
  };
}
