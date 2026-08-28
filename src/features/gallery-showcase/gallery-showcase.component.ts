import { Component, OnInit, OnDestroy, HostListener, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GalleryService } from '../../core/services/gallery.service';

export interface GalleryImage {
  src: string;
  alt?: string;
}

type LightboxSection = 'programs' | 'events' | null;

@Component({
  selector: 'app-gallery-showcase',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './gallery-showcase.component.html',
  styleUrl: './gallery-showcase.component.css',
})
export class GalleryShowcaseComponent implements OnInit, OnDestroy {
  private galleryService = inject(GalleryService);

  heroImages = signal<string[]>([]);
  programs = signal<GalleryImage[]>([]);
  events = signal<GalleryImage[]>([]);

  private readonly prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  loadedImages = signal<Set<string>>(new Set());
  /** نسبة العرض/الارتفاع الحقيقية لكل صورة — بتتحسب وقت أول تحميل، وبتتحط كـ aspect-ratio عشان الـ masonry يحترم الحجم الأصلي */
  imageAspect = signal<Map<string, number>>(new Map());

  // ============================================
  // Marquee (صفين بيتحركوا بعكس بعض، loop لانهائي)
  // ============================================
  marqueeRowTop = computed(() => this.buildMarqueeRow(0));
  marqueeRowBottom = computed(() => this.buildMarqueeRow(1));

  private buildMarqueeRow(offset: 0 | 1): string[] {
    const all = this.heroImages();
    const row = all.filter((_, i) => i % 2 === offset);
    if (!row.length) return [];
    // بتتكرر مرتين عشان الـ translate(-50%) يعمل loop سلس بدون فجوة
    return [...row, ...row];
  }

  // ============================================
  // Lightbox state
  // ============================================
  lightboxSection = signal<LightboxSection>(null);
  lightboxIndex = signal(0);
  originX = signal(50);
  originY = signal(50);
  imgVisible = signal(true);

  get isLightboxOpen(): boolean {
    return this.lightboxSection() !== null;
  }

  currentImage = computed<GalleryImage | null>(() => {
    const list = this.activeList();
    return list[this.lightboxIndex()] ?? null;
  });

  ngOnInit(): void {
    this.heroImages.set(this.galleryService.getHeroImages());
    this.programs.set(this.galleryService.getPrograms());
    this.events.set(this.galleryService.getEvents());
  }

  ngOnDestroy(): void {
    document.body.style.overflow = '';
  }

  private activeList(): GalleryImage[] {
    const section = this.lightboxSection();
    if (section === 'programs') return this.programs();
    if (section === 'events') return this.events();
    return [];
  }

  // ============================================
  // Image loading — بيحسب النسبة الحقيقية للصورة
  // ============================================
  onImageLoad(event: Event, src: string): void {
    const img = event.target as HTMLImageElement;
    if (img.naturalWidth && img.naturalHeight) {
      const updated = new Map(this.imageAspect());
      updated.set(src, img.naturalWidth / img.naturalHeight);
      this.imageAspect.set(updated);
    }
    const loaded = new Set(this.loadedImages());
    loaded.add(src);
    this.loadedImages.set(loaded);
  }

  isImageLoaded(src: string): boolean {
    return this.loadedImages().has(src);
  }

  getAspectRatio(src: string): number | null {
    return this.imageAspect().get(src) ?? null;
  }

  // ============================================
  // 3D Tilt + glow يتبع الماوس
  // ============================================
  onTileTilt(event: MouseEvent): void {
    if (this.prefersReduced) return;
    const el = event.currentTarget as HTMLElement;
    const rect = el.getBoundingClientRect();
    const px = (event.clientX - rect.left) / rect.width;
    const py = (event.clientY - rect.top) / rect.height;
    const rotateY = (px - 0.5) * 8;
    const rotateX = (0.5 - py) * 8;
    el.style.setProperty('--tilt-x', `${rotateX}deg`);
    el.style.setProperty('--tilt-y', `${rotateY}deg`);
    el.style.setProperty('--glow-x', `${px * 100}%`);
    el.style.setProperty('--glow-y', `${py * 100}%`);
  }

  onTileTiltReset(event: MouseEvent): void {
    const el = event.currentTarget as HTMLElement;
    el.style.setProperty('--tilt-x', '0deg');
    el.style.setProperty('--tilt-y', '0deg');
  }

  // ============================================
  // Lightbox actions
  // ============================================
  openLightbox(event: MouseEvent, section: 'programs' | 'events', index: number): void {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    this.originX.set(Math.round((event.clientX / vw) * 100));
    this.originY.set(Math.round((event.clientY / vh) * 100));
    this.lightboxSection.set(section);
    this.lightboxIndex.set(index);
    this.imgVisible.set(true);
    document.body.style.overflow = 'hidden';
  }

  closeLightbox(): void {
    this.lightboxSection.set(null);
    document.body.style.overflow = '';
  }

  lightboxNext(): void {
    this.navigate(1);
  }

  lightboxPrev(): void {
    this.navigate(-1);
  }

  private navigate(dir: 1 | -1): void {
    const total = this.activeList().length;
    if (!total) return;

    this.imgVisible.set(false);
    setTimeout(() => {
      this.lightboxIndex.update((i) => (i + dir + total) % total);
      this.imgVisible.set(true);
    }, 180); // لازم يساوي مدة fade-out في الـ CSS
  }

  @HostListener('document:keydown', ['$event'])
  onKeydown(event: KeyboardEvent): void {
    if (!this.isLightboxOpen) return;
    if (event.key === 'Escape') this.closeLightbox();
    else if (event.key === 'ArrowRight') this.lightboxNext();
    else if (event.key === 'ArrowLeft') this.lightboxPrev();
  }
}