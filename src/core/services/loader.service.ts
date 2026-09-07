import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  isVisible = signal(true);

  // -- Show the Global Loader --
  show(): void {
    this.isVisible.set(true);
  }

  // -- Hide the Global Loader --
  hide(): void {
    this.isVisible.set(false);
  }
}
