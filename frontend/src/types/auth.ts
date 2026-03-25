export interface AuthUser {
  id: string;
  email: string;
  displayName: string;
  createdAt: string;
}

export interface LoginBody {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  userId: string;
  email: string;
  displayName: string;
}
