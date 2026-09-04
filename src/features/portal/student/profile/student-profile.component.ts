import { Component, inject } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-student-profile',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './student-profile.component.html',
  styleUrl: './student-profile.component.css',
})
export class StudentProfileComponent {
  authService = inject(AuthService);
  currentUser = this.authService.currentUser;

}
