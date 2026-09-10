import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import {
  Consultation,
  ConsultationStatus,
  CreateConsultationPayload,
  ReviewConsultationPayload,
} from '../models/student.model';

@Injectable({ providedIn: 'root' })
export class ConsultationService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/consultations`;

  // -- Create Consultation Request --
  create(payload: CreateConsultationPayload): Observable<{ message: string; consultation: Consultation }> {
    return this.http.post<{ message: string; consultation: Consultation }>(this.baseUrl, payload);
  }

  // -- My Consultations --
  getMine(status?: ConsultationStatus): Observable<{ data: Consultation[]; total: number }> {
    let params = new HttpParams();
    if (status) params = params.set('status', status);
    return this.http.get<{ data: Consultation[]; total: number }>(this.baseUrl, { params });
  }

  // -- Consultation Details --
  getById(id: string): Observable<Consultation> {
    return this.http.get<Consultation>(`${this.baseUrl}/${id}`);
  }

  // -- Cancel Consultation (only PENDING) --
  cancel(id: string): Observable<{ message: string; consultation: Consultation }> {
    return this.http.patch<{ message: string; consultation: Consultation }>(
      `${this.baseUrl}/${id}/cancel`,
      {},
    );
  }

  // -- Review Consultation (only COMPLETED) --
  review(
    id: string,
    payload: ReviewConsultationPayload,
  ): Observable<{ message: string; review: { id: string; rating: number; comment: string | null } }> {
    return this.http.post<{
      message: string;
      review: { id: string; rating: number; comment: string | null };
    }>(`${this.baseUrl}/${id}/review`, payload);
  }
}
