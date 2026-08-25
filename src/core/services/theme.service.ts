import { Injectable, signal, effect, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export type ThemeMode = 'light' | 'dark';
export type Direction = 'ltr' | 'rtl';
export type Language = 'ar' | 'en';

const THEME_KEY = 'tamkeenova-theme';
const LANG_KEY = 'tamkeenova-lang';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private translate = inject(TranslateService);

  theme = signal<ThemeMode>(this.getStoredTheme());
  language = signal<Language>(this.getStoredLanguage());

  constructor() {
    this.translate.addLangs(['ar', 'en']);

    effect(() => {
      const theme = this.theme();
      document.documentElement.setAttribute('data-theme', theme);
      localStorage.setItem(THEME_KEY, theme);
    });

    effect(() => {
      const lang = this.language();
      const dir: Direction = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.setAttribute('lang', lang);
      document.documentElement.setAttribute('dir', dir);
      localStorage.setItem(LANG_KEY, lang);
      this.translate.use(lang);
    });
  }

  toggleTheme(): void {
    this.theme.set(this.theme() === 'light' ? 'dark' : 'light');
  }

  setTheme(mode: ThemeMode): void {
    this.theme.set(mode);
  }

  toggleLanguage(): void {
    this.language.set(this.language() === 'ar' ? 'en' : 'ar');
  }

  setLanguage(lang: Language): void {
    this.language.set(lang);
  }

  private getStoredTheme(): ThemeMode {
    const stored = localStorage.getItem(THEME_KEY) as ThemeMode | null;
    if (stored) return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  private getStoredLanguage(): Language {
    const stored = localStorage.getItem(LANG_KEY) as Language | null;
    return stored ?? 'ar';
  }
}