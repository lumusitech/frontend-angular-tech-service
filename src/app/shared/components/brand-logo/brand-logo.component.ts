import { Component, input } from '@angular/core';

@Component({
  selector: 'app-brand-logo',
  standalone: true,
  template: `
    <svg
      [class]="size() + ' ' + customClass()"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      aria-hidden="true"
    >
      <!-- Hexágono pointy-top -->
      <path d="M12 2.8 L20 7.4 L20 16.6 L12 21.2 L4 16.6 L4 7.4 Z" />
      <!-- Check mark -->
      <polyline points="7.5,12.8 10.7,16 16.6,9.4" stroke-width="2.5" />
      @if (variant() === 'full') {
        <!-- Línea de workflow y nodos -->
        <line x1="6.5" y1="19" x2="17.5" y2="19" stroke-width="1.5" stroke-dasharray="2.5 2.5" />
        <circle cx="6.5" cy="19" r="1.3" fill="currentColor" stroke="none" />
        <circle cx="17.5" cy="19" r="1.3" fill="currentColor" stroke="none" />
      }
    </svg>
  `,
})
export class BrandLogoComponent {
  readonly variant = input<'full' | 'mark'>('full');
  readonly size = input<string>('w-7 h-7');
  readonly customClass = input<string>('text-blue-600 dark:text-blue-400');
}
