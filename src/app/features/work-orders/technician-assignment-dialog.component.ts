import { Component, inject, signal, OnInit } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { User } from '../../core/models/user.interfaces';
import { ApiResponse } from '../../core/models/api-response.interfaces';

interface DialogData {
  workOrderId: string;
  currentTechnicianIds: string[];
}

@Component({
  selector: 'app-technician-assignment-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatListModule,
    MatProgressSpinnerModule,
    FormsModule,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>engineering</mat-icon>
      Asignar Técnicos
    </h2>

    <mat-dialog-content class="!p-6">
      @if (techniciansResource.isLoading()) {
        <div class="flex justify-center py-8">
          <mat-spinner diameter="36" />
        </div>
      } @else if (techniciansResource.hasValue()) {
        <mat-selection-list [(ngModel)]="selectedIds" (selectionChange)="onSelectionChange($event)">
          @for (tech of techniciansResource.value().data; track tech.id) {
            <mat-list-option [value]="tech.id">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span class="text-blue-600 text-sm font-medium">{{ tech.name.charAt(0) }}</span>
                </div>
                <div>
                  <p class="font-medium">{{ tech.name }}</p>
                  <p class="text-xs text-gray-500">{{ tech.email }}</p>
                </div>
              </div>
            </mat-list-option>
          }
        </mat-selection-list>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>Cancelar</button>
      <button mat-flat-button color="primary" (click)="onSave()" [disabled]="saving()">
        {{ saving() ? 'Guardando...' : 'Guardar Técnicos' }}
      </button>
    </mat-dialog-actions>
  `,
})
export class TechnicianAssignmentDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<TechnicianAssignmentDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly selectedIds: string[] = [...this.data.currentTechnicianIds];
  readonly saving = signal(false);

  readonly techniciansResource = httpResource<PaginatedResponse<User>>(() => ({
    url: '/api/users?role=technician&limit=100',
    transform: (res: ApiResponse<PaginatedResponse<User>>) => res.data,
  }));

  onSelectionChange(event: MatSelectionListChange): void {
    this.selectedIds.length = 0;
    for (const option of event.options) {
      if (option.selected) {
        this.selectedIds.push(option.value);
      }
    }
  }

  onSave(): void {
    this.saving.set(true);
    this.workOrdersService.replaceTechnicians(this.data.workOrderId, this.selectedIds).subscribe({
      next: () => {
        this.saving.set(false);
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }
}
