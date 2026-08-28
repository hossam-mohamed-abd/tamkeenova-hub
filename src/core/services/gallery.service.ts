import { Injectable } from '@angular/core';
import { GalleryImage } from '../../features/gallery-showcase/gallery-showcase.component.js';
import { GALLERY_HERO_IMAGES, GALLERY_PROGRAMS_IMAGES, GALLERY_EVENTS_IMAGES } from '../data/gallery.data';

@Injectable({ providedIn: 'root' })
export class GalleryService {
  // TODO: لما الباك اند يجهز، استبدل الدوال دي بنداء HttpClient على /api/gallery
  // - الاسم ونوع الإرجاع لازم يفضلوا زي ما هم عشان الكومبوننت متتأثرش.

  getHeroImages(): string[] {
    return GALLERY_HERO_IMAGES;
  }

  getPrograms(): GalleryImage[] {
    return GALLERY_PROGRAMS_IMAGES;
  }

  getEvents(): GalleryImage[] {
    return GALLERY_EVENTS_IMAGES;
  }
}