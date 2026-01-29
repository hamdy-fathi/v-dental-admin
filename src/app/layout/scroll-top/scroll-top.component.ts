import {
  ChangeDetectionStrategy,
  Component,
  HostListener,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-scroll-top',
  imports: [ButtonModule],
  template: `
    @if (isScrolled()) {
      <p-button
        size="large"
        styleClass="scroll-top-button opacity-20 hover:opacity-100"
        (onClick)="scrollToTop()"
        icon="fa fa-arrow-up"
      />
    }
  `,
  styles: `
    :host ::ng-deep .scroll-top-button {
      position: fixed;
      z-index: 1000;
      bottom: 1.5rem;
      inset-start-end: 1.5rem;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ScrollTopComponent {
  isScrolled = signal(false);

  @HostListener('window:scroll', [])
  onScroll(): void {
    this.isScrolled.set(window.scrollY > 100);
  }

  scrollToTop(): void {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
}
