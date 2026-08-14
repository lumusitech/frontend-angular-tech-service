import { Component, input, inject, signal } from '@angular/core';
import { ReportsService } from '../../../core/services/reports.service';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-export-buttons',
  imports: [MatIconModule, MatMenuModule, TranslatePipe],
  template: `
    @if (iconOnly()) {
      <button
        type="button"
        [matMenuTriggerFor]="exportMenu"
        [disabled]="downloading()"
        class="w-11 h-11 rounded-xl text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/60 active:scale-95 transition-all inline-flex items-center justify-center shrink-0 cursor-pointer disabled:opacity-50"
      >
        <mat-icon class="text-[28px]! w-7! h-7!">file_download</mat-icon>
      </button>
    } @else {
      <button
        type="button"
        [matMenuTriggerFor]="exportMenu"
        [disabled]="downloading()"
        class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 hover:bg-gray-50 dark:hover:bg-gray-750 shadow-2xs active:scale-95 transition-all inline-flex items-center gap-2 shrink-0 min-h-11 cursor-pointer disabled:opacity-50"
      >
        <div
          class="w-5 h-5 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0"
        >
          <mat-icon class="w-4! h-4! text-base! leading-none">file_download</mat-icon>
        </div>
        <span>{{ 'reports.export.export' | translate }}</span>
        <mat-icon class="w-4! h-4! text-base! text-gray-400 -ml-0.5">expand_more</mat-icon>
      </button>
    }

    <mat-menu
      #exportMenu="matMenu"
      class="rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
    >
      @if (workOrderId()) {
        <button mat-menu-item (click)="downloadBudget()" [disabled]="downloading()" class="gap-2">
          <mat-icon class="text-rose-500">picture_as_pdf</mat-icon>
          <span>{{ 'reports.export.budget' | translate }}</span>
        </button>
      }
      @if (paymentId()) {
        <button mat-menu-item (click)="downloadReceipt()" [disabled]="downloading()" class="gap-2">
          <mat-icon class="text-emerald-500">receipt_long</mat-icon>
          <span>{{ 'reports.export.receipt' | translate }}</span>
        </button>
      }
    </mat-menu>
  `,
})
export class ExportButtonsComponent {
  private readonly reportsService = inject(ReportsService);

  workOrderId = input<string>('');
  paymentId = input<string>('');
  iconOnly = input(false);

  readonly downloading = signal(false);

  downloadBudget(): void {
    const id = this.workOrderId();
    if (!id) return;

    this.downloading.set(true);
    this.reportsService.downloadBudgetPdf(id).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, `presupuesto-${id}.pdf`);
        this.downloading.set(false);
      },
      error: () => this.downloading.set(false),
    });
  }

  downloadReceipt(): void {
    const id = this.paymentId();
    if (!id) return;

    this.downloading.set(true);
    this.reportsService.downloadReceiptPdf(id).subscribe({
      next: (blob) => {
        this.downloadBlob(blob, `recibo-${id}.pdf`);
        this.downloading.set(false);
      },
      error: () => this.downloading.set(false),
    });
  }

  private downloadBlob(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  }
}
