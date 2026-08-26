import { Component, computed, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { RouterLink } from '@angular/router';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component.js';

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
  }

  submit(): void {
    this.touched.set(true);
    if (!this.isValid() || this.submitting()) return;

    this.submitting.set(true);

    // TODO: استبدل الـ setTimeout ده بنداء API حقيقي على الـ backend لما يجهز
    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
    }, 1200);
  }

  resetForm(): void {
    this.serviceField.set('');
    this.otherFieldDetail.set('');
    this.contactName.set('');
    this.phone.set('');
    this.details.set('');
    this.touched.set(false);
    this.submitted.set(false);
    this.audience.set('b2b');
  }
}