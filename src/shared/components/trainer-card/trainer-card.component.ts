import { Component, inject, input, signal } from '@angular/core';
import { Trainer } from '../../../core/models/trainer.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { BookingService } from '../../../core/services/booking.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-trainer-card',
  standalone: true,
  imports: [StarRatingComponent, TranslatePipe],
  templateUrl: './trainer-card.component.html',
  styleUrl: './trainer-card.component.css',
})
export class TrainerCardComponent {
  trainer = input.required<Trainer>();
  index = input<number>(0);

  private bookingService = inject(BookingService);

  flipped = signal(false);

  toggleFlip(): void {
    this.flipped.set(!this.flipped());
  }

  openBooking(event: Event): void {
    event.stopPropagation(); 
    this.bookingService.open(this.trainer());
  }
}