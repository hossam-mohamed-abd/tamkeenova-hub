import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import {
  ApiDataResponse,
  ApiSuccessMessage,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResendOtpRequest,
  User,
  VerifyEmailRequest,
} from '../models/auth.model';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private http = inject(HttpClient);
  private router = inject(Router);
  private baseUrl = `${environment.apiUrl}/auth`;

  private _currentUser = signal<User | null>(this.readUserFromStorage());
  currentUser = this._currentUser.asReadonly();

  isLoggedIn = computed(() => !!this._currentUser() && !!this.getToken());
  role = computed(() => this._currentUser()?.role ?? null);
  isTrainer = computed(() => this.role() === 'TRAINER');
  isStudent = computed(() => this.role() === 'STUDENT');
  isAdmin = computed(() => this.role() === 'ADMIN');

  // Register
  register(payload: RegisterRequest) {
    return this.http.post<ApiSuccessMessage>(`${this.baseUrl}/register`, payload);
  }

  // Verify Email
  verifyEmail(payload: VerifyEmailRequest) {
    return this.http.post<ApiSuccessMessage>(`${this.baseUrl}/verify-email`, payload);
  }

  // Resend OTP
  resendOtp(payload: ResendOtpRequest) {
    return this.http.post<ApiSuccessMessage>(`${this.baseUrl}/resend-otp`, payload);
  }

  // Login
  login(payload: LoginRequest) {
    return this.http.post<LoginResponse>(`${this.baseUrl}/login`, payload);
  }

  setSession(response: LoginResponse): void {
    const { access_token, user } = response.data;
    localStorage.setItem(TOKEN_KEY, access_token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    this._currentUser.set(user);
  }

  // Current User
  fetchCurrentUser() {
    return this.http.get<ApiDataResponse<User>>(`${this.baseUrl}/me`);
  }

  refreshCurrentUser(): void {
    this.fetchCurrentUser().subscribe({
      next: (res) => {
        localStorage.setItem(USER_KEY, JSON.stringify(res.data));
        this._currentUser.set(res.data);
      },
      error: () => this.logout(),
    });
  }

  // Storage Helpers
  getToken(): string | null {
    try {
      return localStorage.getItem(TOKEN_KEY);
    } catch {
      return null;
    }
  }

  private readUserFromStorage(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;

    try {
      return JSON.parse(raw) as User;
    } catch {
      localStorage.removeItem(USER_KEY);
      localStorage.removeItem(TOKEN_KEY);
      return null;
    }
  }

  // Logout
  logout(redirect = true): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    this._currentUser.set(null);
    if (redirect) this.router.navigate(['/login']);
  }

  private pendingEmail = signal<string | null>(null);
  setPendingEmail(email: string): void {
    this.pendingEmail.set(email);
  }
  getPendingEmail(): string | null {
    return this.pendingEmail();
  }
}
