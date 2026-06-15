import { Component, input } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-page-header',
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="flex items-center justify-between">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">{{ title() }}</h1>
        @if (subtitle()) {
          <p class="text-gray-500 dark:text-gray-400 mt-1">{{ subtitle() }}</p>
        }
      </div>
      @if (actionLabel()) {
        <button mat-flat-button color="primary" (click)="onAction()">
          @if (actionIcon()) {
            <mat-icon>{{ actionIcon() }}</mat-icon>
          }
          {{ actionLabel() }}
        </button>
      }
    </div>
  `,
})
export class PageHeaderComponent {
  title = input.required<string>();
  subtitle = input<string>('');
  actionLabel = input<string>('');
  actionIcon = input<string>('');
  action = input<() => void>();

  onAction(): void {
    const fn = this.action();
    if (fn) fn();
  }
}
