export type UserRole = 'STUDENT' | 'TRAINER' | 'ADMIN';

export interface User {
  id: string;
  full_name: string;
  username: string;
  email: string;
  phone?: string;
  role: UserRole;
  is_email_verified?: boolean;
}

export interface RegisterRequest {
  full_name: string;
  email: string;
  phone: string;
  password: string;
  role: UserRole;
  username?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponseData {
  access_token: string;
  user: User;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  data: LoginResponseData;
}

export interface ApiSuccessMessage {
  success: boolean;
  message: string;
}

export interface ApiDataResponse<T> {
  success: boolean;
  data: T;
}

export interface VerifyEmailRequest {
  email: string;
  otp: string;
}

export interface ResendOtpRequest {
  email: string;
}

export interface ApiError {
  statusCode: number;
  message: string;
}
