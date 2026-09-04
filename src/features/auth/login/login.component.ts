import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './login.component.html',
  styleUrl: '../register/register.component.css',
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required]],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    this.authService.login(this.form.getRawValue()).subscribe({
      next: (res) => {
        this.authService.setSession(res);
        this.isLoading.set(false);

        const role = res.data.user.role;
        if (role === 'TRAINER') {
          this.router.navigate(['/portal/trainer']);
        } else if (role === 'ADMIN') {
          this.router.navigate(['/portal/admin']);
        } else {
          this.router.navigate(['/portal/student']);
        }
      },
      error: (err) => {
        this.isLoading.set(false);
        const msg = err?.error?.message;
        this.errorMessage.set(
          Array.isArray(msg) ? msg[0] : (msg ?? 'auth.errors.invalid_credentials'),
        );
      },
    });
  }
}
