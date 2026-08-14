import { Component, signal, output } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-portal-search',
  imports: [MatFormFieldModule, MatInputModule, MatIconModule, TranslatePipe],
  template: `
    <div class="flex-1 flex flex-col items-center justify-center gap-6">
      <div class="flex flex-col items-center gap-4">
        <div
          class="w-16 h-16 rounded-2xl bg-blue-50 dark:bg-blue-950/50 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center"
        >
          <mat-icon class="!w-7 !h-7 text-blue-600 dark:text-blue-400">manage_search</mat-icon>
        </div>
        <div class="text-center space-y-1.5">
          <h2 class="text-xl font-semibold text-gray-900 dark:text-white tracking-tight">
            {{ 'portal.search.title' | translate }}
          </h2>
          <p class="text-sm text-gray-500 dark:text-gray-400 max-w-xs">
            {{ 'portal.search.subtitle' | translate }}
          </p>
        </div>
      </div>

      <div class="w-full max-w-sm">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'portal.search.placeholder' | translate }}</mat-label>
          <mat-icon matPrefix class="!mr-2 !text-gray-400 dark:!text-gray-500">search</mat-icon>
          <input
            matInput
            [value]="trackingCode()"
            (input)="trackingCode.set($any($event.target).value)"
            (keyup.enter)="onTrack()"
            placeholder="TS-A1B2C3"
          />
        </mat-form-field>
        <p class="text-xs text-center text-gray-400 dark:text-gray-500 -mt-3">
          {{ 'portal.search.example' | translate }}
        </p>
      </div>
    </div>
  `,
})
export class PortalSearchComponent {
  readonly track = output<string>();
  readonly trackingCode = signal('');

  onTrack(): void {
    const code = this.trackingCode().trim();
    if (code) {
      this.track.emit(code);
    }
  }
}
