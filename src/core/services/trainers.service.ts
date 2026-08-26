import { Injectable } from '@angular/core';
import { Trainer } from '../models/trainer.model';
import { TRAINERS } from '../data/trainers.data';

@Injectable({ providedIn: 'root' })
export class TrainersService {
  // TODO: لما الباك اند يجهز، استبدل جسم الدوال دي بنداء HttpClient على /api/trainers


  getAll(): Trainer[] {
    return TRAINERS;
  }

  getFeatured(limit = 8): Trainer[] {
    return TRAINERS.slice(0, limit);
  }

  getBySlug(slug: string): Trainer | undefined {
    return TRAINERS.find((t) => t.slug === slug);
  }
}