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