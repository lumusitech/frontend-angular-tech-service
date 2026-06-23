import { Component, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { WorkOrderNote } from '../../../core/models/work-order.interfaces';
import { StatusBadgeComponent } from '../../../shared/components/status-badge/status-badge.component';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-notes-tab',
  imports: [DatePipe, MatIconModule, MatButtonModule, StatusBadgeComponent, TranslatePipe],
  template: `
    <div class="p-4">
      <div class="flex justify-end mb-4">
        <button mat-stroked-button color="primary" (click)="addNote.emit()">
          <mat-icon>add</mat-icon>
          {{ 'workOrders.notes.addNote' | translate }}
        </button>
      </div>
      @if (!notes() || notes().length === 0) {
        <p class="text-gray-500 dark:text-gray-400 text-center py-8">
          {{ 'workOrders.notes.noNotes' | translate }}
        </p>
      } @else {
        <div class="space-y-3">
          @for (note of notes(); track note.id) {
            <div class="p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <div class="flex items-center gap-2 mb-1">
                <app-status-badge [value]="note.type" type="noteType" />
                <span class="text-xs text-gray-400 dark:text-gray-500">
                  {{ note.createdBy?.name }} - {{ note.createdAt | date: 'dd/MM/yyyy HH:mm' }}
                </span>
              </div>
              <p class="text-sm">{{ note.content }}</p>
            </div>
          }
        </div>
      }
    </div>
  `,
})
export class NotesTabComponent {
  notes = input.required<WorkOrderNote[]>();
  addNote = output<void>();
}
