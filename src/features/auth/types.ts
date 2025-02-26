export interface RegisterDTO {
  username: string;
  email: string;
  password: string;
}

export interface LoginDTO {
  credential: string;
  password: string;
}

export interface LogoutDTO {
  refreshToken: string;
}

export interface RefreshTokenDTO {
  refreshToken: string;
}

export interface TokenPayload {
  userId: number;
  tokenVersion: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}
