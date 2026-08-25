import { Component, OnDestroy, OnInit, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { FooterComponent } from "../../shared/components/footer/footer.component";

interface ServiceCard {
  icon: string;
  titleKey: string;
  descKey: string;
  linkKey: string;
  route: string;
}

interface TeamPreview {
  name: string;
  roleKey?: string;
  role: string;
  initials: string;
}

interface Partner {
  name: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterLink, TranslatePipe, FooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css',
})
export class HomeComponent implements OnInit, OnDestroy {
  heroImages = [
    '/images/hero/hero1.jpg',
    '/images/hero/hero2.jpg',
    '/images/hero/hero3.jpg',
    '/images/hero/hero4.jpg',
    '/images/hero/hero5.jpg',
    '/images/hero/hero6.jpg',
    '/images/hero/hero7.jpg',
  ];
  activeHeroIndex = signal(0);
  private heroTimer?: ReturnType<typeof setInterval>;

  galleryImages: string[] = [
    '/images/events/hero1.jpg',
    '/images/events/hero2.jpg',
    '/images/events/hero3.jpg',
  ];

  stats = [
    { value: 7, suffix: '+', labelKey: 'home.stats.trainees' },
    { value: 6, suffix: '+', labelKey: 'home.stats.programs' },
    { value: 155, suffix: '+', labelKey: 'home.stats.hours' },
    { value: 5, suffix: '+', labelKey: 'home.stats.partnerships' },
    { value: 20, suffix: '+', labelKey: 'home.stats.team' },
  ];

  services: ServiceCard[] = [
    {
      icon: 'fa-solid fa-shield-halved',
      titleKey: 'home.services.portal.title',
      descKey: 'home.services.portal.desc',
      linkKey: 'home.services.portal.link',
      route: '/portal',
    },
    {
      icon: 'fa-solid fa-graduation-cap',
      titleKey: 'home.services.programs.title',
      descKey: 'home.services.programs.desc',
      linkKey: 'home.services.programs.link',
      route: '/programs',
    },
    {
      icon: 'fa-solid fa-handshake',
      titleKey: 'home.services.consulting.title',
      descKey: 'home.services.consulting.desc',
      linkKey: 'home.services.consulting.link',
      route: '/consulting',
    },
  ];

  teamPreview: TeamPreview[] = [
    { name: 'د. إسلام رجب', role: 'خبير الاستشارات الإدارية وتطوير الأعمال', initials: 'إر' },
    { name: 'أ. سارة أحمد علي', role: 'استشاري الصحة النفسية والإرشاد الأسري', initials: 'سأ' },
    { name: 'د. محمود حسن', role: 'مدرب خبير في التحول الرقمي والذكاء الاصطناعي', initials: 'مح' },
    { name: 'أ. مريم يوسف', role: 'أخصائي التطوير المهني والمهارات الناعمة', initials: 'مي' },
  ];

  partnersImages: string[] = [
    '/images/partners/partners1.png',
    '/images/partners/partners2.png',
    '/images/partners/partners3.png',
    '/images/partners/partners4.png',
    '/images/partners/partners5.png',
  ];

  get partnersLoop(): string[] {
    return [...this.partnersImages, ...this.partnersImages];
  }

  whatsappUrl =
    'https://api.whatsapp.com/send/?phone=201013494727&text=%D9%85%D8%B1%D8%AD%D8%A8%D8%A7%D9%8B+TamkeeNova+HUB+%D8%A8%D8%AE%D8%B5%D9%88%D8%B5...&type=phone_number&app_absent=0';

  contactChannels: {
    key: string;
    icon: string;
    labelKey: string;
    value: string;
    href: string;
    external?: boolean;
  }[] = [
    {
      key: 'phone',
      icon: 'fa-solid fa-phone',
      labelKey: 'contact.phone_label',
      value: '01013494727',
      href: 'tel:01013494727',
    },
    {
      key: 'email',
      icon: 'fa-solid fa-envelope',
      labelKey: 'contact.email_label',
      value: 'info@tamkeenova.com',
      href: 'mailto:info@tamkeenova.com',
    },
    {
      key: 'facebook',
      icon: 'fa-brands fa-facebook-f',
      labelKey: 'contact.facebook_label',
      value: 'TamkeeNova HUB',
      href: 'https://www.facebook.com/share/1Ro5wdyHB4/',
      external: true,
    },
  ];

  ngOnInit(): void {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    this.heroTimer = setInterval(() => {
      this.activeHeroIndex.set((this.activeHeroIndex() + 1) % this.heroImages.length);
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.heroTimer) clearInterval(this.heroTimer);
  }
}
