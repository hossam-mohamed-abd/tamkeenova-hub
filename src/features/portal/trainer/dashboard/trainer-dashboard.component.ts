import { Component, computed, inject, signal, OnInit } from '@angular/core';
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
export class TrainerDashboardComponent implements OnInit {
  authService = inject(AuthService);
  private trainerService = inject(TrainerService);
  private router = inject(Router);

  currentUser = this.authService.currentUser;
  isLoading = signal(true);
  stats = signal<TrainerDashboardStats | null>(null);
  hasError = signal(false);

  // احسب الاكتمال بشكل مستقر - لا يختفي فجأة
  profileCompletion = computed(() => {
    const s = this.stats();
    if (!s) return 0;
    let completed = 0;
    const total = 6;
    // 1: برامج
    if ((s.programs_count ?? 0) > 0) completed++;
    // 2: مواعيد
    if ((s.availability_count ?? 0) > 0) completed++;
    // 3: تقييمات
    if ((s.reviews_count ?? 0) > 0) completed++;
    // 4: بروفايل أساسي (دائما موجود)
    completed++;
    // 5: متوسط تقييم
    const avg = typeof s.average_rating === 'string' ? parseFloat(s.average_rating as any) : (s.average_rating ?? 0);
    if (avg > 0) completed++;
    // 6: استشارات (ميزة جديدة)
    completed++;
    return Math.round((completed / total) * 100);
  });

  // دائما اعرض الأقسام حتى لو stats فشل - استخدم fallback
  displayStats = computed(() => {
    const s = this.stats();
    if (s) return s;
    // fallback لمنع اختفاء الأجزاء
    return {
      programs_count: 0,
      reviews_count: 0,
      availability_count: 0,
      average_rating: 0,
      ratings_count: 0,
    } as TrainerDashboardStats;
  });

  showCompletion = computed(() => {
    const comp = this.profileCompletion();
    const s = this.stats();
    // لو مفيش stats، اعرض الاكتمال 0%، لو اكتمال 100% اخفيه بسلاسة
    if (!s) return true;
    return comp < 100;
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

  ngOnInit(): void {
    this.loadStats();
  }

  loadStats(): void {
    this.isLoading.set(true);
    this.hasError.set(false);
    this.trainerService.getDashboardStats().subscribe({
      next: (res) => {
        // API قد يرجع { data: {...} } أو مباشرة {...}
        const data = (res as any).data ?? res;
        this.stats.set(data as TrainerDashboardStats);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Dashboard stats error', err);
        this.hasError.set(true);
        // لا تترك stats null لتجنب اختفاء الأجزاء - استخدم fallback
        // لكن isLoading false لإظهار UI
        this.isLoading.set(false);
      },
    });
  }

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }
}
