import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ConsultationService } from '../../../../core/services/consultation.service';
import { Consultation, ConsultationStatus } from '../../../../core/models/student.model';

@Component({
  selector: 'app-student-consultations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, TranslatePipe],
  templateUrl: './student-consultations.component.html',
  styleUrls: ['../../portal-shared.css', './student-consultations.component.css'],
})
export class StudentConsultationsComponent {
  private consultationService = inject(ConsultationService);

  isLoading = signal(true);
  consultations = signal<Consultation[]>([]);
  activeFilter = signal<ConsultationStatus | 'ALL'>('ALL');

  selected = signal<Consultation | null>(null);
  loadingDetails = signal(false);
  cancelTarget = signal<Consultation | null>(null);
  isCancelling = signal(false);

  reviewTarget = signal<Consultation | null>(null);
  reviewRating = signal(5);
  reviewComment = signal('');
  isReviewing = signal(false);
  toastMessage = signal<string | null>(null);

  readonly statuses: Array<ConsultationStatus | 'ALL'> = [
    'ALL',
    'PENDING',
    'APPROVED',
    'SCHEDULED',
    'COMPLETED',
    'REJECTED',
    'CANCELLED',
  ];

  filtered = computed(() => {
    const f = this.activeFilter();
    const list = this.consultations();
    return f === 'ALL' ? list : list.filter((c) => c.status === f);
  });

  constructor() {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.consultationService.getMine().subscribe({
      next: (res) => {
        this.consultations.set(res.data ?? []);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  setFilter(status: ConsultationStatus | 'ALL'): void {
    this.activeFilter.set(status);
  }

  openDetails(item: Consultation): void {
    this.selected.set(item);
    this.loadingDetails.set(true);
    this.consultationService.getById(item.id).subscribe({
      next: (res) => {
        this.selected.set(res);
        this.loadingDetails.set(false);
      },
      error: () => this.loadingDetails.set(false),
    });
  }

  closeDetails(): void {
    this.selected.set(null);
  }

  askCancel(item: Consultation): void {
    this.cancelTarget.set(item);
  }

  closeCancel(): void {
    this.cancelTarget.set(null);
  }

  confirmCancel(): void {
    const target = this.cancelTarget();
    if (!target) return;
    this.isCancelling.set(true);
    this.consultationService.cancel(target.id).subscribe({
      next: () => {
        this.consultations.update((list) =>
          list.map((c) =>
            c.id === target.id ? { ...c, status: 'CANCELLED' as ConsultationStatus } : c,
          ),
        );
        this.isCancelling.set(false);
        this.cancelTarget.set(null);
        this.closeDetails();
        this.showToast('student_consultations.cancel_success');
      },
      error: () => this.isCancelling.set(false),
    });
  }

  openReview(item: Consultation): void {
    this.reviewTarget.set(item);
    this.reviewRating.set(5);
    this.reviewComment.set('');
  }

  closeReview(): void {
    this.reviewTarget.set(null);
  }

  setRating(n: number): void {
    this.reviewRating.set(n);
  }

  submitReview(): void {
    const target = this.reviewTarget();
    if (!target || this.isReviewing()) return;
    this.isReviewing.set(true);
    this.consultationService
      .review(target.id, {
        rating: this.reviewRating(),
        comment: this.reviewComment().trim() || undefined,
      })
      .subscribe({
        next: () => {
          this.isReviewing.set(false);
          this.closeReview();
          this.showToast('student_consultations.review_success');
        },
        error: () => this.isReviewing.set(false),
      });
  }

  private showToast(key: string): void {
    this.toastMessage.set(key);
    setTimeout(() => this.toastMessage.set(null), 3500);
  }

  badgeClass(status: ConsultationStatus): string {
    if (status === 'APPROVED' || status === 'SCHEDULED' || status === 'COMPLETED')
      return 'badge-approved';
    if (status === 'PENDING') return 'badge-pending';
    return 'badge-rejected';
  }
}
