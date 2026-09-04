import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-dashboard',
  standalone: true,
  imports: [RouterLink, TranslatePipe],
  templateUrl: './trainer-dashboard.component.html',
  styleUrl: './trainer-dashboard.component.css',
})
export class TrainerDashboardComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;
}
