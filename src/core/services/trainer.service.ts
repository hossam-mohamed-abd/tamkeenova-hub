import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { tap } from 'rxjs';
import { environment } from '../../environments/environment';
import { ApiDataResponse, ApiSuccessMessage } from '../models/auth.model';
import {
  ApplicationStatusData,
  AvailabilityPayload,
  AvailabilitySlot,
  ProgramPayload,
  TrainerDashboardStats,
  TrainerProfile,
  TrainerProgram,
  TrainerReview,
  UpdateTrainerProfilePayload,
} from '../models/trainer-profile.model';

@Injectable({ providedIn: 'root' })
export class TrainerService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/trainers`;

  /** بيتحفظ في الذاكرة أول ما الحالة تبقى APPROVED عشان الـ guard ما يعملش request كل مرة */
  private approvedCached = false;

  get isApprovedCached(): boolean {
    return this.approvedCached;
  }

  /** نادِها في AuthService.logout() */
  resetCache(): void {
    this.approvedCached = false;
  }

  getMyProfile() {
    return this.http.get<TrainerProfile>(`${this.baseUrl}/me`);
  }

  updateMyProfile(payload: UpdateTrainerProfilePayload) {
    return this.http.patch<ApiSuccessMessage>(`${this.baseUrl}/me`, payload);
  }

  getApplicationStatus() {
    return this.http
      .get<ApiDataResponse<ApplicationStatusData>>(`${this.baseUrl}/application-status`)
      .pipe(
        tap((res) => {
          if (res.data.status === 'APPROVED') this.approvedCached = true;
        }),
      );
  }

  // ---- Programs ----
  getPrograms() {
    return this.http.get<TrainerProgram[]>(`${this.baseUrl}/programs`);
  }

  createProgram(payload: ProgramPayload) {
    return this.http.post<ApiSuccessMessage>(`${this.baseUrl}/programs`, payload);
  }

  updateProgram(id: string, payload: ProgramPayload) {
    return this.http.put<ApiSuccessMessage>(`${this.baseUrl}/programs/${id}`, payload);
  }

  deleteProgram(id: string) {
    return this.http.delete<ApiSuccessMessage>(`${this.baseUrl}/programs/${id}`);
  }

  // ---- Availability ----
  getAvailability() {
    return this.http.get<AvailabilitySlot[]>(`${this.baseUrl}/availability`);
  }

  createAvailability(payload: AvailabilityPayload) {
    return this.http.post<ApiSuccessMessage>(`${this.baseUrl}/availability`, payload);
  }

  updateAvailability(id: string, payload: Partial<AvailabilityPayload>) {
    return this.http.patch<ApiSuccessMessage>(`${this.baseUrl}/availability/${id}`, payload);
  }

  deleteAvailability(id: string) {
    return this.http.delete<ApiSuccessMessage>(`${this.baseUrl}/availability/${id}`);
  }

  // ---- Reviews ----
  getTrainerReviews(trainerId: string) {
    return this.http.get<TrainerReview[]>(`${this.baseUrl}/${trainerId}/reviews`);
  }

  createReview(trainerId: string, payload: { rating: number; comment: string }) {
    return this.http.post<ApiSuccessMessage>(`${this.baseUrl}/${trainerId}/reviews`, payload);
  }

  // ---- Dashboard ----
  getDashboardStats() {
    return this.http.get<ApiDataResponse<TrainerDashboardStats>>(`${this.baseUrl}/dashboard`);
  }
}
