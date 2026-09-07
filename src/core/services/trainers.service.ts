import { Injectable } from '@angular/core';
import { Trainer } from '../models/trainer.model';
import { TRAINERS } from '../data/trainers.data';

@Injectable({ providedIn: 'root' })
export class TrainersService {


  // -- Retrieve All Trainers --
  getAll(): Trainer[] {
    return TRAINERS;
  }

  // -- Retrieve Featured Trainers --
  getFeatured(limit = 8): Trainer[] {
    return TRAINERS.slice(0, limit);
  }

  // -- Retrieve a Trainer by Slug --
  getBySlug(slug: string): Trainer | undefined {
    return TRAINERS.find((t) => t.slug === slug);
  }
}
