import { Component, HostListener, inject, signal, computed, ElementRef } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { ThemeService } from '../../../core/services/theme.service.js';
import { AuthService } from '../../../core/services/auth.service';

interface NavLink {
  labelKey: string;
  route: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, TranslatePipe],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css',
})
export class NavbarComponent {
  themeService = inject(ThemeService);
  authService = inject(AuthService);
  private router = inject(Router);
  private elementRef = inject(ElementRef);

  isScrolled = signal(false);
  isMobileMenuOpen = signal(false);
  isUserMenuOpen = signal(false);

  isDark = computed(() => this.themeService.theme() === 'dark');
  isArabic = computed(() => this.themeService.language() === 'ar');

  isLoggedIn = this.authService.isLoggedIn;
  currentUser = this.authService.currentUser;

  // أول حرفين من الاسم عشان الـ avatar fallback
  userInitials = computed(() => {
    const name = this.currentUser()?.full_name ?? '';
    return name
      .trim()
      .split(/\s+/)
      .slice(0, 2)
      .map((part) => part.charAt(0).toUpperCase())
      .join('');
  });

  roleLabel = computed(() => {
    const role = this.authService.role();
    switch (role) {
      case 'TRAINER':
        return 'nav.role_trainer';
      case 'ADMIN':
        return 'nav.role_admin';
      default:
        return 'nav.role_student';
    }
  });

  dashboardRoute = computed(() => {
    const role = this.authService.role();
    if (role === 'TRAINER') return '/portal/trainer';
    if (role === 'ADMIN') return '/portal/admin';
    return '/portal/student';
  });

  navLinks: NavLink[] = [
    { labelKey: 'nav.home', route: '/' },
    { labelKey: 'nav.programs', route: '/programs' },
    { labelKey: 'nav.portal', route: '/portal' },
    { labelKey: 'nav.consulting', route: '/consulting' },
    { labelKey: 'nav.team', route: '/team' },
    { labelKey: 'nav.gallery', route: '/gallery' },
  ];

  @HostListener('window:scroll')
  onWindowScroll(): void {
    this.isScrolled.set(window.scrollY > 24);
  }

  // يقفل الـ dropdown لو ضغط بره الناف بار
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (!this.isUserMenuOpen()) return;
    const clickedInside = this.elementRef.nativeElement.contains(event.target);
    if (!clickedInside) {
      this.isUserMenuOpen.set(false);
    }
  }

  // يقفل الـ dropdown بزرار Escape
  @HostListener('document:keydown.escape')
  onEscape(): void {
    this.isUserMenuOpen.set(false);
  }

  toggleUserMenu(): void {
    this.isUserMenuOpen.update((v) => !v);
  }

  closeUserMenu(): void {
    this.isUserMenuOpen.set(false);
  }

  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  toggleLanguage(): void {
    this.themeService.toggleLanguage();
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen.update((v) => !v);
    document.body.style.overflow = this.isMobileMenuOpen() ? 'hidden' : '';
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen.set(false);
    this.isUserMenuOpen.set(false);
    document.body.style.overflow = '';
  }

  logout(): void {
    this.closeMobileMenu();
    this.authService.logout();
  }



  // اللينك بتاع "بياناتي الشخصية" اللي هيفتح كومبوننت البروفايل حسب الدور
  profileRoute = computed(() => {
    const role = this.authService.role();
    if (role === 'TRAINER') return '/portal/trainer/profile';
    return '/portal/student/profile';
  });

}
