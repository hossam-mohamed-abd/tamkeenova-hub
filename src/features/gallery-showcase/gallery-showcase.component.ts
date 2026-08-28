import { Component, OnInit, OnDestroy, HostListener, computed, inject, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { GalleryService } from '../../core/services/gallery.service';

export interface GalleryImage {
  src: string;
  alt?: string;
}

interface Tile {
  image: GalleryImage;
  tileClass: string;
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

  // 4 أشكال خلايا متنوعة تتكرر بترتيب يعطي شكل Bento منظم مهما كان عدد الصور
  private readonly tilePattern = ['t-a', 't-c', 't-d', 't-b'];

  private readonly prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  private readonly heroIntervalMs = 2600;
  private heroTimer?: ReturnType<typeof setInterval>;

  activeHeroIndex = signal(0);
  loadedImages = signal<Set<string>>(new Set());

  programTiles = computed<Tile[]>(() => this.buildTiles(this.programs()));
  eventTiles = computed<Tile[]>(() => this.buildTiles(this.events()));

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
    // TODO: لما الباك اند يجهز، الدوال دي جوه GalleryService هي اللي هتتغيّر
    this.heroImages.set(this.galleryService.getHeroImages());
    this.programs.set(this.galleryService.getPrograms());
    this.events.set(this.galleryService.getEvents());

    if (!this.prefersReduced && this.heroImages().length > 1) {
      this.heroTimer = setInterval(() => {
        this.activeHeroIndex.update((i) => (i + 1) % this.heroImages().length);
      }, this.heroIntervalMs);
    }
  }

  ngOnDestroy(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
    document.body.style.overflow = '';
  }

  private buildTiles(images: GalleryImage[]): Tile[] {
    return images.map((image, i) => ({
      image,
      tileClass: this.tilePattern[i % this.tilePattern.length],
    }));
  }

  private activeList(): GalleryImage[] {
    const section = this.lightboxSection();
    if (section === 'programs') return this.programs();
    if (section === 'events') return this.events();
    return [];
  }

  onImageLoad(src: string): void {
    const updated = new Set(this.loadedImages());
    updated.add(src);
    this.loadedImages.set(updated);
  }

  isImageLoaded(src: string): boolean {
    return this.loadedImages().has(src);
  }

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