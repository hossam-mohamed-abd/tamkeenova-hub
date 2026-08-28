import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  isVisible = signal(true);

  dismiss(): void {
    this.isVisible.set(false);
  }
}