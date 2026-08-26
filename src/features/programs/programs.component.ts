import { Component, computed, signal } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component.js';
import { Program, ProgramFormat, ProgramLevel } from '../../core/models/program.model';

@Component({
  selector: 'app-programs',
  standalone: true,
  imports: [TranslatePipe, FormsModule, PageHeaderComponent],
  templateUrl: './programs.component.html',
  styleUrl: './programs.component.css'
})
export class ProgramsComponent {

  
  // private allPrograms = signal<Program[]>([
  //   {
  //     id: 'prog-001',
  //     slug: 'digital-transformation-basics',
  //     title: { ar: 'أساسيات التحول الرقمي', en: 'Digital Transformation Basics' },
  //     description: {
  //       ar: 'برنامج تدريبي يقدّم أساسيات التحول الرقمي وتطبيقاته في بيئة العمل، بشهادة معتمدة.',
  //       en: 'A training program covering digital transformation fundamentals and workplace applications.',
  //     },
  //     category: 'digital',
  //     level: 'beginner',
  //     format: 'hybrid',
  //     durationHours: 24,
  //     coverImage: '/images/programs/digital-transformation.jpg',
  //     isOpen: true,
  //     seatsLeft: 12,
  //   },
  //   {
  //     id: 'prog-002',
  //     slug: 'management-consulting-essentials',
  //     title: { ar: 'أساسيات الاستشارات الإدارية', en: 'Management Consulting Essentials' },
  //     description: {
  //       ar: 'مقدمة عملية في مهارات الاستشارات الإدارية وتطوير الأعمال للمؤسسات والأفراد.',
  //       en: 'A practical introduction to management consulting and business development skills.',
  //     },
  //     category: 'management',
  //     level: 'intermediate',
  //     format: 'onsite',
  //     durationHours: 18,
  //     coverImage: '/images/programs/management-consulting.jpg',
  //     isOpen: true,
  //     seatsLeft: 5,
  //   },
  //   {
  //     id: 'prog-003',
  //     slug: 'ai-for-business',
  //     title: { ar: 'الذكاء الاصطناعي لريادة الأعمال', en: 'AI for Business' },
  //     description: {
  //       ar: 'كيفية توظيف أدوات الذكاء الاصطناعي في تطوير الأعمال واتخاذ القرار.',
  //       en: 'How to leverage AI tools for business development and decision-making.',
  //     },
  //     category: 'digital',
  //     level: 'advanced',
  //     format: 'online',
  //     durationHours: 30,
  //     coverImage: '/images/programs/ai-for-business.jpg',
  //     isOpen: false,
  //   },
  // ]);
  private allPrograms = signal<Program[]>([]);

  searchTerm = signal('');
  selectedCategory = signal<string>('all');
  selectedFormat = signal<ProgramFormat | 'all'>('all');
  selectedLevel = signal<ProgramLevel | 'all'>('all');

  categories = computed(() => {
    const unique = new Set(this.allPrograms().map((p) => p.category));
    return Array.from(unique);
  });

  filteredPrograms = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const category = this.selectedCategory();
    const format = this.selectedFormat();
    const level = this.selectedLevel();

    return this.allPrograms().filter((program) => {
      const matchesTerm =
        !term ||
        program.title.ar.toLowerCase().includes(term) ||
        program.title.en.toLowerCase().includes(term);
      const matchesCategory = category === 'all' || program.category === category;
      const matchesFormat = format === 'all' || program.format === format;
      const matchesLevel = level === 'all' || program.level === level;

      return matchesTerm && matchesCategory && matchesFormat && matchesLevel;
    });
  });

  hasAnyPrograms = computed(() => this.allPrograms().length > 0);

  levelLabelKey(level: ProgramLevel): string {
    return `programs.level.${level}`;
  }

  formatLabelKey(format: ProgramFormat): string {
    return `programs.format.${format}`;
  }
}