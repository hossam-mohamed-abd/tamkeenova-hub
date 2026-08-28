import { AfterViewInit, Component, ElementRef, OnDestroy, ViewChild, inject } from '@angular/core';
import { LoaderService } from '../../../core/services/loader.service';

@Component({
  selector: 'app-loader',
  standalone: true,
  templateUrl: './app-loader.component.html',
  styleUrl: './app-loader.component.css'
})
export class AppLoaderComponent implements AfterViewInit, OnDestroy {
  loader = inject(LoaderService);

  @ViewChild('root') private rootRef?: ElementRef<HTMLDivElement>;
  @ViewChild('gatePath') private gatePathRef?: ElementRef<SVGPathElement>;
  @ViewChild('tPath') private tPathRef?: ElementRef<SVGPathElement>;

  private timers: ReturnType<typeof setTimeout>[] = [];

  ngAfterViewInit(): void {
    const root = this.rootRef?.nativeElement;
    const gate = this.gatePathRef?.nativeElement;
    const t = this.tPathRef?.nativeElement;

    if (!root || !gate || !t) {
      this.finish();
      return;
    }

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) {
      root.classList.add('is-filled');
      this.schedule(() => this.finish(), 450);
      return;
    }

    // بنحسب طول كل مسار فعلياً بدل ما نفترض رقم ثابت، عشان الرسم يبقى دقيق مهما اتغيرت الأبعاد
    const gateLength = gate.getTotalLength();
    const tLength = t.getTotalLength();

    gate.style.strokeDasharray = `${gateLength}`;
    gate.style.strokeDashoffset = `${gateLength}`;
    t.style.strokeDasharray = `${tLength}`;
    t.style.strokeDashoffset = `${tLength}`;

    // فريمين فاضيين عشان نضمن القيم الابتدائية دي اتطبقت فعلاً قبل ما نشغّل الـ transition
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        this.schedule(() => {
          gate.classList.add('is-drawing');
          gate.style.strokeDashoffset = '0';
        }, 150);

        this.schedule(() => {
          t.classList.add('is-drawing');
          t.style.strokeDashoffset = '0';
        }, 420);

        this.schedule(() => root.classList.add('is-filled'), 1500);
        this.schedule(() => root.classList.add('is-pulsing'), 2000);
        this.schedule(() => root.classList.remove('is-pulsing'), 2500);
        this.schedule(() => root.classList.add('is-leaving'), 2700);
        this.schedule(() => this.finish(), 3200);
      });
    });
  }

  ngOnDestroy(): void {
    this.timers.forEach((timer) => clearTimeout(timer));
  }

  private schedule(fn: () => void, delay: number): void {
    this.timers.push(setTimeout(fn, delay));
  }

  private finish(): void {
    this.loader.dismiss();
  }
}