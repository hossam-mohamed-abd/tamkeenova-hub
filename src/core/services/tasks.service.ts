import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, map, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  CreateTaskPayload,
  MyTaskItem,
  ReviewPayload,
  Task,
  TaskAssignee,
  TaskComment,
  TaskStatus,
  TasksDashboardStats,
} from '../models/tasks.model';

@Injectable({ providedIn: 'root' })
export class TasksService {
  private http = inject(HttpClient);
  private baseUrl = `${environment.apiUrl}/tasks`;

  // ==================== Admin ====================

  // -- Create a New Task (Admin) --
  create(payload: CreateTaskPayload): Observable<Task> {
    return this.unwrap(this.http.post<any>(this.baseUrl, payload));
  }

  // -- List All Tasks (Admin) --
  getAll(status?: TaskStatus | 'ALL'): Observable<Task[]> {
    let params = new HttpParams();
    if (status && status !== 'ALL') params = params.set('status', status);
    return this.unwrap(
      this.http.get<any>(this.baseUrl, { params }).pipe(
        map((res) => (Array.isArray(res) ? res : (res?.data ?? []))),
      ),
    );
  }

  // -- Update a Task (Admin) --
  update(id: string, payload: Partial<CreateTaskPayload>): Observable<Task> {
    return this.unwrap(this.http.patch<any>(`${this.baseUrl}/${id}`, payload));
  }

  // -- Delete a Task (Admin) --
  delete(id: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  // -- Add an Assignee to a Task (Admin) --
  addAssignee(taskId: string, user_id: string, task_order: number): Observable<TaskAssignee> {
    return this.unwrap(this.http.post<any>(`${this.baseUrl}/${taskId}/assignees`, { user_id, task_order }));
  }

  // -- Remove an Assignee from a Task (Admin) --
  removeAssignee(taskId: string, userId: string): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${taskId}/assignees/${userId}`);
  }

  // -- Review a Submission (Admin) --
  review(assigneeId: string, payload: ReviewPayload): Observable<TaskAssignee> {
    return this.unwrap(this.http.patch<any>(`${this.baseUrl}/assignees/${assigneeId}/review`, payload));
  }

  // -- List Submissions of a Task (Admin) --
  getSubmissions(taskId: string): Observable<TaskAssignee[]> {
    return this.unwrap(
      this.http.get<any>(`${this.baseUrl}/${taskId}/submissions`).pipe(
        map((res) => (Array.isArray(res) ? res : (res?.data ?? []))),
      ),
    );
  }

  // ==================== Member (Employee / Volunteer) ====================

  // -- My Assigned Tasks --
  getMyTasks(): Observable<MyTaskItem[]> {
    return this.unwrap(
      this.http.get<any>(`${this.baseUrl}/my`).pipe(
        map((res) => {
          const body = Array.isArray(res) ? res : (res?.data ?? []);
          return Array.isArray(body) ? body : (body?.data ?? []);
        }),
      ),
    );
  }

  // -- Start Working on a Task --
  // The endpoint targets the task id, with a graceful fallback to the assignee id.
  start(taskId: string, fallbackAssigneeId?: string): Observable<unknown> {
    return this.tryOrFallback(`${this.baseUrl}/${taskId}/start`, `${this.baseUrl}/${fallbackAssigneeId}/start`);
  }

  // -- Submit Task Deliverables (multipart, up to 10 files) --
  submit(taskId: string, content: string | null, linkUrl: string | null, files: File[], fallbackAssigneeId?: string): Observable<unknown> {
    const build = () => {
      const fd = new FormData();
      if (content) fd.append('content', content);
      if (linkUrl) fd.append('link_url', linkUrl);
      for (const file of files) fd.append('files', file);
      return fd;
    };
    return this.tryOrFallback(
      `${this.baseUrl}/${taskId}/submit`,
      `${this.baseUrl}/${fallbackAssigneeId}/submit`,
      () => build(),
    );
  }

  // -- Task Comments --
  getComments(taskId: string, fallbackAssigneeId?: string): Observable<TaskComment[]> {
    return this.tryOrFallback(
      `${this.baseUrl}/${taskId}/comments`,
      `${this.baseUrl}/${fallbackAssigneeId}/comments`,
      undefined,
      (res) => (Array.isArray(res) ? res : (res?.data ?? [])),
    );
  }

  // -- Add a Comment --
  addComment(taskId: string, body: string, fallbackAssigneeId?: string): Observable<TaskComment> {
    return this.tryOrFallback(
      `${this.baseUrl}/${taskId}/comments`,
      `${this.baseUrl}/${fallbackAssigneeId}/comments`,
      () => ({ body }),
    );
  }

  // -- Tasks Dashboard (Employee / Volunteer) --
  getDashboard(): Observable<TasksDashboardStats> {
    return this.unwrap(this.http.get<any>(`${this.baseUrl}/dashboard`)).pipe(
      map((res: any) => (res?.data ?? res)),
    );
  }

  // ==================== Helpers ====================

  private unwrap(obs: Observable<any>): Observable<any> {
    return obs.pipe(map((res) => res?.data ?? res));
  }

  // Tries the documented endpoint shape; on 404/405/400 retries the fallback URL.
  private tryOrFallback(
    primaryUrl: string,
    fallbackUrl: string,
    body?: () => any,
    transform?: (res: any) => any,
  ): Observable<any> {
    const send = (url: string) => {
      if (body) {
        const payload = body();
        return payload instanceof FormData
          ? this.http.post<any>(url, payload)
          : this.http.request<any>('PATCH', url, { body: payload });
      }
      return this.http.request<any>('PATCH', url, { body: {} });
    };

    return send(primaryUrl).pipe(
      map((res) => (transform ? transform(res) : (res?.data ?? res))),
      catchError((err) => {
        const status = err?.status;
        if (fallbackUrl && (status === 404 || status === 405 || status === 400)) {
          return send(fallbackUrl).pipe(map((res) => (transform ? transform(res) : (res?.data ?? res))));
        }
        return throwError(() => err);
      }),
    );
  }
}
