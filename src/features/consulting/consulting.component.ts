import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { Router, RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component.js';
import { AuthService } from '../../core/services/auth.service';
import { CorporateRequestService } from '../../core/services/corporate-request.service';

type AudienceType = 'b2b' | 'b2c';

interface ServiceFieldOption {
  value: string;
  labelKey: string;
}

@Component({
  selector: 'app-consulting',
  standalone: true,
  imports: [FormsModule, TranslatePipe, RouterLink, PageHeaderComponent],
  templateUrl: './consulting.component.html',
  styleUrl: './consulting.component.css',
})
export class ConsultingComponent {
  private authService = inject(AuthService);
  private corporateService = inject(CorporateRequestService);
  private router = inject(Router);

  isLoggedIn = this.authService.isLoggedIn;
  isStudent = this.authService.isStudent;
  currentUser = this.authService.currentUser;

  audience = signal<AudienceType>('b2b');

  serviceFieldOptions: ServiceFieldOption[] = [
    { value: 'business_strategy', labelKey: 'consultingPage.form.fields.business_strategy' },
    { value: 'digital_marketing', labelKey: 'consultingPage.form.fields.digital_marketing' },
    { value: 'financial', labelKey: 'consultingPage.form.fields.financial' },
    { value: 'hr_training', labelKey: 'consultingPage.form.fields.hr_training' },
    { value: 'digital_transformation', labelKey: 'consultingPage.form.fields.digital_transformation' },
    { value: 'governance_hr', labelKey: 'consultingPage.form.fields.governance_hr' },
    { value: 'other', labelKey: 'consultingPage.form.fields.other' },
  ];

  serviceField = signal('');
  otherFieldDetail = signal('');
  contactName = signal('');
  phone = signal('');
  details = signal('');

  submitting = signal(false);
  submitted = signal(false);
  touched = signal(false);
  needsLogin = signal(false);
  submitError = signal<string | null>(null);

  isOther = computed(() => this.serviceField() === 'other');

  isValid = computed(() => {
    const base =
      this.serviceField().trim() !== '' &&
      this.contactName().trim() !== '' &&
      this.phone().trim() !== '' &&
      this.details().trim() !== '';
    return base && (!this.isOther() || this.otherFieldDetail().trim() !== '');
  });

  setAudience(type: AudienceType): void {
    this.audience.set(type);
    this.needsLogin.set(false);
    this.submitError.set(null);
  }

  submit(): void {
    this.touched.set(true);
    if (!this.isValid() || this.submitting()) return;

    // -- Guests must log in first --
    if (!this.isLoggedIn()) {
      this.needsLogin.set(true);
      return;
    }

    // -- Individuals book a trainer consultation instead --
    if (this.audience() === 'b2c') {
      this.router.navigate([this.isStudent() ? '/portal/student/trainers' : '/team']);
      return;
    }

    this.submitting.set(true);
    this.submitError.set(null);

    const user = this.currentUser();
    const fieldLabel = this.isOther() ? this.otherFieldDetail().trim() : this.serviceField();

    this.corporateService
      .create({
        contact_name: this.contactName().trim(),
        contact_email: user?.email ?? '',
        contact_phone: this.phone().trim() || undefined,
        company_name: this.contactName().trim(),
        service_type: this.mapServiceType(this.serviceField()),
        service_description: `[${fieldLabel}] ${this.details().trim()}`,
      })
      .subscribe({
        next: () => {
          this.submitting.set(false);
          this.submitted.set(true);
        },
        error: (err) => {
          this.submitting.set(false);
          const msg = err?.error?.message;
          this.submitError.set(Array.isArray(msg) ? msg[0] : (msg ?? 'auth.errors.generic'));
        },
      });
  }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToMyRequests(): void {
    this.router.navigate(['/portal/student/corporate-requests']);
  }

  resetForm(): void {
    this.serviceField.set('');
    this.otherFieldDetail.set('');
    this.contactName.set('');
    this.phone.set('');
    this.details.set('');
    this.touched.set(false);
    this.submitted.set(false);
    this.needsLogin.set(false);
    this.submitError.set(null);
    this.audience.set('b2b');
  }

  // -- Map the UI field to the API service type --
  private mapServiceType(field: string): string {
    switch (field) {
      case 'hr_training':
      case 'digital_transformation':
        return 'CORPORATE_TRAINING';
      case 'business_strategy':
      case 'digital_marketing':
      case 'financial':
      case 'governance_hr':
        return 'CONSULTING';
      default:
        return 'OTHER';
    }
  }
}
