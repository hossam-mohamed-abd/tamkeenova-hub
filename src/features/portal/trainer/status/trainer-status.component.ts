import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';
import { TrainerService } from '../../../../core/services/trainer.service';
import { ApplicationStatusData } from '../../../../core/models/trainer-profile.model';

@Component({
  selector: 'app-trainer-status',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './trainer-status.component.html',
  styleUrl: './trainer-status.component.css',
})
export class TrainerStatusComponent {
  private trainerService = inject(TrainerService);
  private authService = inject(AuthService);
  private router = inject(Router);

  authCurrentUser = this.authService.currentUser;

  isLoading = signal(true);
  errorMessage = signal<string | null>(null);
  status = signal<ApplicationStatusData | null>(null);

  constructor() {
    this.load();
  }

  load(): void {
    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.trainerService.getApplicationStatus().subscribe({
      next: (res) => {
        this.isLoading.set(false);
        this.status.set(res.data);

        if (res.data.status === 'APPROVED') {
          this.router.navigate(['/portal/trainer']);
        }
      },
      error: () => {
        this.isLoading.set(false);
        this.errorMessage.set('auth.errors.generic');
      },
    });
  }

  refresh(): void {
    this.load();
  }

  logout(): void {
    this.authService.logout();
  }
}
