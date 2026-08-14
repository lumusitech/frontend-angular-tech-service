import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { PortalNote } from '../../core/models/portal.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';

@Component({
  selector: 'app-portal-notes',
  imports: [MatIconModule, MatCardModule, TranslatePipe, RelativeDatePipe],
  template: `
    <mat-card>
      <mat-card-content class="!p-5">
        <h3 class="text-sm font-semibold text-gray-900 dark:text-white mb-4">
          {{ 'portal.notes.title' | translate }}
        </h3>

        <div class="space-y-3">
          @for (note of notes(); track note.createdAt; let last = $last) {
            <div class="flex gap-3">
              <div
                class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                [class]="getNoteClasses(note.type)"
              >
                <mat-icon class="!w-3.5 !h-3.5">{{ getNoteIcon(note.type) }}</mat-icon>
              </div>
              <div
                class="flex-1 min-w-0"
                [class.pb-3]="!last"
                [class.border-b]="!last"
                [class.border-gray-100]="!last"
                [class.dark:border-gray-800]="!last"
              >
                <div class="flex items-center gap-2 mb-1">
                  <span
                    class="text-[11px] font-semibold uppercase tracking-wider"
                    [class]="getNoteLabelClasses(note.type)"
                  >
                    {{ 'portal.notes.types.' + note.type | translate }}
                  </span>
                  <span class="text-[11px] text-gray-400 dark:text-gray-500">
                    {{ note.createdAt | relativeDate }}
                  </span>
                </div>
                <p class="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">
                  {{ note.content }}
                </p>
              </div>
            </div>
          }
        </div>
      </mat-card-content>
    </mat-card>
  `,
})
export class PortalNotesComponent {
  readonly notes = input.required<PortalNote[]>();

  getNoteIcon(type: string): string {
    const icons: Record<string, string> = {
      diagnosis: 'healing',
      issue: 'warning_amber',
      observation: 'info',
    };
    return icons[type] || 'note';
  }

  getNoteClasses(type: string): string {
    const classes: Record<string, string> = {
      diagnosis: 'bg-blue-50 dark:bg-blue-950/30 text-blue-600 dark:text-blue-400',
      issue: 'bg-amber-50 dark:bg-amber-950/30 text-amber-600 dark:text-amber-400',
      observation: 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400',
    };
    return classes[type] || 'bg-gray-50 dark:bg-gray-800 text-gray-500 dark:text-gray-400';
  }

  getNoteLabelClasses(type: string): string {
    const classes: Record<string, string> = {
      diagnosis: 'text-blue-600 dark:text-blue-400',
      issue: 'text-amber-600 dark:text-amber-400',
      observation: 'text-gray-500 dark:text-gray-400',
    };
    return classes[type] || 'text-gray-500 dark:text-gray-400';
  }
}
