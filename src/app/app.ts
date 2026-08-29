import { Component, OnDestroy, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationStart, NavigationEnd, NavigationCancel, NavigationError } from '@angular/router';
import { Subscription } from 'rxjs';
import { NavbarComponent } from '../shared/components/navbar/navbar.component';
import { AiAssistantComponent } from '../shared/components/ai-assistant/ai-assistant.component';
import { BookingModalComponent } from '../shared/components/booking-modal/booking-modal.component';
import { AppLoaderComponent } from '../shared/components/app-loader/app-loader.component';
import { LoaderService } from '../core/services/loader.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, NavbarComponent, AiAssistantComponent, BookingModalComponent, AppLoaderComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnDestroy {
  protected readonly title = signal('tamkeenova-hub_anguler');

  private loader = inject(LoaderService);
  private router = inject(Router);

  private isFirstNavigation = true;
  private routerSub: Subscription;

  constructor() {
    setTimeout(() => this.loader.hide(), 2600);

    this.routerSub = this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        if (!this.isFirstNavigation) {
          this.loader.show();
        }
      } else if (
        event instanceof NavigationEnd ||
        event instanceof NavigationCancel ||
        event instanceof NavigationError
      ) {
        if (this.isFirstNavigation) {
          this.isFirstNavigation = false;
        } else {
          this.loader.hide();
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.routerSub.unsubscribe();
  }
}