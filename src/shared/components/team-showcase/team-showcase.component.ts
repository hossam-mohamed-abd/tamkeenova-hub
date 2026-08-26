import {
  Component,
  OnInit,
  OnDestroy,
  HostListener,
  effect,
  input,
  signal,
  inject,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Trainer } from '../../../core/models/trainer.model';
import { StarRatingComponent } from '../star-rating/star-rating.component';
import { BookingService } from '../../../core/services/booking.service';

interface TeamSlot {
  currentTrainer: Trainer;
  nextTrainer: Trainer;
  sliding: boolean;
  resetting: boolean;
}

@Component({
  selector: 'app-team-showcase',
  standalone: true,
  imports: [StarRatingComponent, TranslatePipe],
  templateUrl: './team-showcase.component.html',
  styleUrl: './team-showcase.component.css',
})
export class TeamShowcaseComponent implements OnInit, OnDestroy {
  trainers = input.required<Trainer[]>();

  private bookingService = inject(BookingService);
  private readonly prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ===== نفس ميكانيزم الـ Partners wave-slide =====
  private readonly staggerMs = 220;
  private readonly slideDurationMs = 650;
  private readonly wavePauseMs = 1400;

  private slotsCount = 4;
  private slotPointers: number[] = [];
  private timers: ReturnType<typeof setTimeout>[] = [];
  private waveScheduleTimer?: ReturnType<typeof setTimeout>;
  private isPaused = false;

  slots = signal<TeamSlot[]>([]);

  constructor() {
    effect(() => {
      const list = this.trainers();
      if (list.length) this.initSlots();
    });
  }

  @HostListener('window:resize')
  onResize(): void {
    const prevCount = this.slotsCount;
    this.updateSlotsCount();
    if (prevCount !== this.slotsCount) this.initSlots();
  }

  ngOnInit(): void {
    this.updateSlotsCount();
  }

  ngOnDestroy(): void {
    this.clearTimers();
  }

  onStageEnter(): void {
    this.isPaused = true;
  }

  onStageLeave(): void {
    this.isPaused = false;
  }

  next(): void {
    this.triggerWave(1);
  }

  prev(): void {
    this.triggerWave(-1);
  }

  openBooking(trainer: Trainer): void {
    this.bookingService.open(trainer);
  }

  private updateSlotsCount(): void {
    const w = window.innerWidth;
    if (w >= 1200) this.slotsCount = 4;
    else if (w >= 900) this.slotsCount = 3;
    else if (w >= 640) this.slotsCount = 2;
    else this.slotsCount = 1;
  }

  private initSlots(): void {
    this.clearTimers();
    const list = this.trainers();
    const total = list.length;
    if (!total) {
      this.slots.set([]);
      return;
    }

    const count = Math.min(this.slotsCount, total);
    this.slotPointers = Array.from({ length: count }, (_, i) => i % total);
    this.slots.set(
      this.slotPointers.map((ptr) => ({
        currentTrainer: list[ptr],
        nextTrainer: list[ptr],
        sliding: false,
        resetting: false,
      })),
    );

    if (this.prefersReduced || total <= count) return;

    const startDelay = setTimeout(() => {
      this.runWave(1);
      this.scheduleNextWave();
    }, 1400);
    this.timers.push(startDelay);
  }

  private scheduleNextWave(): void {
    const count = this.slots().length;
    const waveDuration = (count - 1) * this.staggerMs + this.slideDurationMs;
    const totalDelay = waveDuration + this.wavePauseMs;

    this.waveScheduleTimer = setTimeout(() => {
      if (!this.isPaused) this.runWave(1);
      this.scheduleNextWave();
    }, totalDelay);
    this.timers.push(this.waveScheduleTimer);
  }

  /** بينادى موجة فورية — بتتستخدم من أزرار التالي/السابق كمان */
  private triggerWave(dir: 1 | -1): void {
    const total = this.trainers().length;
    const count = this.slots().length;
    if (!total || total <= count) return;
    this.runWave(dir);
  }

  private runWave(dir: 1 | -1): void {
    const count = this.slots().length;
    for (let i = 0; i < count; i++) {
      const t = setTimeout(() => this.startSlide(i, dir), i * this.staggerMs);
      this.timers.push(t);
    }
  }

  private startSlide(idx: number, dir: 1 | -1): void {
    const list = this.trainers();
    const total = list.length;
    const current = this.slots();
    if (!current[idx]) return;

    const ptr = (((this.slotPointers[idx] + dir) % total) + total) % total;
    this.slotPointers[idx] = ptr;
    const nextTrainer = list[ptr];

    const updated = [...current];
    updated[idx] = { ...updated[idx], nextTrainer, sliding: true };
    this.slots.set(updated);

    const t = setTimeout(() => this.finishSlide(idx), this.slideDurationMs);
    this.timers.push(t);
  }

  private finishSlide(idx: number): void {
    const s = this.slots();
    if (!s[idx]) return;
    const updated = [...s];
    updated[idx] = {
      currentTrainer: updated[idx].nextTrainer,
      nextTrainer: updated[idx].nextTrainer,
      sliding: false,
      resetting: true,
    };
    this.slots.set(updated);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const s2 = this.slots();
        if (!s2[idx]) return;
        const u2 = [...s2];
        u2[idx] = { ...u2[idx], resetting: false };
        this.slots.set(u2);
      });
    });
  }

  private clearTimers(): void {
    this.timers.forEach((t) => clearTimeout(t));
    this.timers = [];
    if (this.waveScheduleTimer) clearTimeout(this.waveScheduleTimer);
  }
}