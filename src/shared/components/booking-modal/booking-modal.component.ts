import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { BookingService } from '../../../core/services/booking.service';

type ContactMethod = 'whatsapp' | 'phone' | 'video';

@Component({
  selector: 'app-booking-modal',
  standalone: true,
  imports: [FormsModule, TranslatePipe],
  templateUrl: './booking-modal.component.html',
  styleUrl: './booking-modal.component.css',
})
export class BookingModalComponent {
  bookingService = inject(BookingService);

  trainer = computed(() => this.bookingService.activeTrainer());
  isOpen = computed(() => this.trainer() !== null);

  name = signal('');
  phone = signal('');
  topic = signal('');
  contactMethod = signal<ContactMethod>('whatsapp');

  submitting = signal(false);
  submitted = signal(false);
  touched = signal(false);

  isValid = computed(
    () => this.name().trim() !== '' && this.phone().trim() !== '' && this.topic().trim() !== ''
  );

  setContactMethod(method: ContactMethod): void {
    this.contactMethod.set(method);
  }

  submit(): void {
    this.touched.set(true);
    if (!this.isValid() || this.submitting()) return;

    this.submitting.set(true);

    setTimeout(() => {
      this.submitting.set(false);
      this.submitted.set(true);
    }, 1200);
  }

  close(): void {
    this.bookingService.close();

    setTimeout(() => {
      this.name.set('');
      this.phone.set('');
      this.topic.set('');
      this.contactMethod.set('whatsapp');
      this.submitting.set(false);
      this.submitted.set(false);
      this.touched.set(false);
    }, 300);
  }

  onBackdropClick(event: MouseEvent): void {
    if (event.target === event.currentTarget) this.close();
  }
}
