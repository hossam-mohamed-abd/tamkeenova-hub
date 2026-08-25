import { Component, HostListener, inject, signal, computed } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service.js';
interface NavLink {
  labelKey: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  themeService = inject(ThemeService);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);

  isDark = computed(() => this.themeService.theme() === 'dark');
  isArabic = computed(() => this.themeService.language() === 'ar');

  navLinks: NavLink[] = [
    { labelKey: 'nav.home', route: '/' },
    { labelKey: 'nav.programs', route: '/programs' },
    { labelKey: 'nav.portal', route: '/portal' },
    { labelKey: 'nav.consulting', route: '/consulting' },
    { labelKey: 'nav.team', route: '/team' },
    { labelKey: 'nav.gallery', route: '/gallery' }
  ];

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 24);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.themeService.toggleLanguage();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update(v => !v);
    document.body.style.overflow = this.isMobileMenuOpen() ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    document.body.style.overflow = '';
  }
}