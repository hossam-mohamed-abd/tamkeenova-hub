import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TrainerService } from '../../../../core/services/trainer.service';
import { TrainerDashboardStats } from '../../../../core/models/trainer-profile.model';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './trainer-dashboard.component.html',
  styleUrl: './trainer-dashboard.component.css',
})
export class TrainerDashboardComponent {
  authService = inject(AuthService);
  private trainerService = inject(TrainerService);

  currentUser = this.authService.currentUser;
  isLoading = signal(true);
  stats = signal<TrainerDashboardStats | null>(null);

  constructor() {
    this.trainerService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats.set(res.data);
        this.isLoading.set(false);
      },
      error: () => this.isLoading.set(false),
    });
  }
}
