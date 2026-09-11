import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TrainerService } from '../../../../core/services/trainer.service';
import { TrainerDashboardStats } from '../../../../core/models/trainer-profile.model';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './trainer-dashboard.component.html',
  styleUrls: ['../../portal-shared.css', './trainer-dashboard.component.css'],
})
export class TrainerDashboardComponent {
  authService = inject(AuthService);
  private trainerService = inject(TrainerService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  isLoading = signal(true);
  stats = signal<TrainerDashboardStats | null>(null);

  profileCompletion = computed(() => {
    const s = this.stats();
    if (!s) return 0;
    let completed = 0;
    const total = 6;
    if (s.programs_count > 0) completed++;
    if (s.availability_count > 0) completed++;
    if (s.reviews_count > 0) completed++;
    completed++;
    if (s.average_rating > 0) completed++;
    completed++; // consultations
    return Math.round((completed / total) * 100);
  });

  quickActions = [
    {
      icon: 'fa-comments',
      labelKey: 'trainer_dashboard.actions.manage_consultations',
      route: '/portal/trainer/consultations',
      color: 'primary',
    },
    {
      icon: 'fa-user-pen',
      labelKey: 'trainer_dashboard.actions.edit_profile',
      route: '/portal/trainer/profile',
      color: 'accent',
    },
    {
      icon: 'fa-book-medical',
      labelKey: 'trainer_dashboard.actions.add_program',
      route: '/portal/trainer/programs',
      color: 'success',
    },
    {
      icon: 'fa-calendar-plus',
      labelKey: 'trainer_dashboard.actions.set_availability',
      route: '/portal/trainer/availability',
      color: 'dark',
    },
  ];

  constructor() {
    this.trainerService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
