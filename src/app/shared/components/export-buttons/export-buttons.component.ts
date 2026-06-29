import { Component, input, inject, signal } from '@angular/core';
import { ReportsService } from '../../../core/services/reports.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-export-buttons',
  imports: [MatIconModule, MatButtonModule, MatMenuModule, TranslatePipe],
  template: `
    <button mat-stroked-button [matMenuTriggerFor]="exportMenu" [disabled]="downloading()">
      <mat-icon>download</mat-icon>
      {{ 'reports.export.export' | translate }}
    </button>
    <mat-menu #exportMenu="matMenu">
      @if (workOrderId()) {
        <button mat-menu-item (click)="downloadBudget()" [disabled]="downloading()">
          <mat-icon>description</mat-icon>
          <span>{{ 'reports.export.budget' | translate }}</span>
        </button>
      }
      @if (paymentId()) {
        <button mat-menu-item (click)="downloadReceipt()" [disabled]="downloading()">
          <mat-icon>receipt</mat-icon>
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
