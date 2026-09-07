import { Component, input, computed, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { Trainer } from '../../../core/models/trainer.model';

@Component({
  selector: 'app-trainer-card',
  standalone: true,
  imports: [CommonModule, RouterLink, TranslatePipe],
  templateUrl: './trainer-card.component.html',
  styleUrl: './trainer-card.component.css',
})
export class TrainerCardComponent {
  trainer = input.required<Trainer>();
  index = input<number>(0);

  book = output<Trainer>();

  readonly bookBtnKey = 'team.book_btn';

  avatar = computed(() => this.trainer().users?.profile_image ?? null);
  name = computed(() => this.trainer().users?.full_name ?? '');
  specialization = computed(
    () => this.trainer().specializations?.name_ar ?? this.trainer().specializations?.name_en ?? '',
  );

  rating = computed(() =>
    this.trainer().average_rating ? parseFloat(this.trainer().average_rating) : 0,
  );
  ratingsCount = computed(() => this.trainer().ratings_count ?? 0);
  experienceYears = computed(() => this.trainer().years_of_experience ?? 0);
  studentsCount = computed(() => this.trainer().total_students ?? 0);
  programsCount = computed(() => this.trainer()._count?.training_programs ?? 0);
  certificatesCount = computed(() => this.trainer().trainer_certificates?.length ?? 0);

  priceFrom = computed(() => this.trainer().consultation_price_from);
  priceTo = computed(() => this.trainer().consultation_price_to);
  hasPriceRange = computed(() => !!this.priceFrom() && !!this.priceTo());
  duration = computed(() => this.trainer().consultation_duration);

  bio = computed(() => this.trainer().bio_ar || this.trainer().bio_en || '');

  initials = computed(() => {
    const n = this.name();
    if (!n) return '';
    const parts = n.trim().split(/\s+/);
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return n.slice(0, 2).toUpperCase();
  });

  onBookClick(event: Event): void {
    event.stopPropagation();
    event.preventDefault();
    this.book.emit(this.trainer());
  }
}
