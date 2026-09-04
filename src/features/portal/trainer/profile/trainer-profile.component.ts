import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-trainer-profile',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './trainer-profile.component.html',
  styleUrl: './trainer-profile.component.css',
})
export class TrainerProfileComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;

}
