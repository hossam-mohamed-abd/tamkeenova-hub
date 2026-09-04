import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { AuthService } from '../../../core/services/auth.service';
import { RegisterRequest, UserRole } from '../../../core/models/auth.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink, TranslatePipe],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private router = inject(Router);

  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  form = this.fb.nonNullable.group({
    full_name: ['', [Validators.required, Validators.minLength(3)]],
    email: ['', [Validators.required, Validators.email]],
    username: [
      '',
      [Validators.required, Validators.minLength(3), Validators.pattern(/^[a-z0-9._]+$/)],
    ],
    phone: ['', [Validators.required, Validators.pattern(/^01[0-2,5]\d{8}$/)]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    role: ['STUDENT' as UserRole, Validators.required], // ← عدّل هنا
  });

  constructor() {
    // لما الإيميل يتغير → يولد الـ username تلقائي (لو المستخدم لسه معدلهوش يدوي)
    this.form.controls.email.valueChanges.subscribe((email) => {
      const currentUsername = this.form.controls.username.value;
      const autoUsername = this.generateUsername(email);

      // لو الـ username فاضي أو لسه مطابق للـ auto السابق → حدثه
      if (!currentUsername || currentUsername === this.lastAutoUsername) {
        this.form.controls.username.setValue(autoUsername, { emitEvent: false });
        this.lastAutoUsername = autoUsername;
      }
    });
  }

  private lastAutoUsername = '';

  private generateUsername(email: string): string {
    if (!email || !email.includes('@')) return '';
    return email
      .split('@')[0]
      .toLowerCase()
      .replace(/[^a-z0-9._]/g, '');
  }

  selectRole(role: UserRole): void {
    this.form.controls.role.setValue(role);
  }

  private extractErrorMessage(err: any): string {
    const msg = err?.error?.message;

    if (Array.isArray(msg)) {
      return msg[0];
    }
    if (typeof msg === 'string') {
      return msg;
    }
    return 'auth.errors.generic';
  }

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);

    const formValue = this.form.getRawValue();

    const payload: RegisterRequest = {
      full_name: formValue.full_name,
      email: formValue.email,
      phone: formValue.phone,
      password: formValue.password,
      role: formValue.role,
      username: formValue.username,
    };

    this.authService.register(payload).subscribe({
      next: () => {
        this.authService.setPendingEmail(formValue.email);
        this.isLoading.set(false);
        this.router.navigate(['/verify-otp']);
      },
      error: (err) => {
        this.isLoading.set(false);
        this.errorMessage.set(this.extractErrorMessage(err));
      },
    });
  }
}
