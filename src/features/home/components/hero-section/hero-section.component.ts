import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.component.html',
  styleUrls: ['./hero-section.component.css']
})
export class HeroSectionComponent {

  stats = [
    {
      value: '5000+',
      label: 'متدرب'
    },
    {
      value: '120+',
      label: 'برنامج تدريبي'
    },
    {
      value: '50+',
      label: 'شريك استراتيجي'
    },
    {
      value: '85%',
      label: 'نسبة التوظيف'
    }
  ];

}