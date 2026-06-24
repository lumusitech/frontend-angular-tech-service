import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { BillingService } from '../../core/services/billing.service';
import { Invoice } from '../../core/models/invoice.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { CurrencyArsPipe } from '../../shared/pipes/currency-ars.pipe';
import { DatePipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-invoice-detail',
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDividerModule,
    MatDialogModule,
    MatProgressSpinnerModule,
    StatusBadgeComponent,
    ErrorStateComponent,
    PageHeaderComponent,
    CurrencyArsPipe,
    DatePipe,
    TranslatePipe,
  ],
  template: `
    <div class="space-y-6">
      @if (invoiceResource.status() === 'loading' && !invoiceResource.hasValue()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (invoiceResource.error()) {
        <app-error-state (retry)="invoiceResource.reload()" />
      } @else if (invoiceResource.hasValue()) {
        @let invoice = invoiceResource.value();

        <app-page-header
          [title]="invoice.invoiceNumber"
          [subtitle]="'billing.types.' + invoice.invoiceType | translate"
        >
          <div class="flex gap-2">
            @if (invoice.status === 'draft') {
              <button mat-flat-button color="primary" (click)="issueInvoice(invoice)">
                <mat-icon>send</mat-icon>
                {{ 'billing.issue' | translate }}
              </button>
            }
            @if (invoice.status === 'issued') {
              <button mat-flat-button color="warn" (click)="cancelInvoice(invoice)">
                <mat-icon>cancel</mat-icon>
                {{ 'billing.cancel' | translate }}
              </button>
            }
            <button mat-stroked-button (click)="downloadPdf(invoice)">
              <mat-icon>download</mat-icon>
              {{ 'billing.downloadPdf' | translate }}
            </button>
          </div>
        </app-page-header>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ 'common.details' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="!p-6">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.invoiceNumber' | translate }}</p>
                    <p class="font-mono">{{ invoice.invoiceNumber }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'common.status' | translate }}</p>
                    <app-status-badge [value]="invoice.status" type="invoiceStatus" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.invoiceType' | translate }}</p>
                    <app-status-badge [value]="invoice.invoiceType" type="invoiceType" />
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.concept' | translate }}</p>
                    <p>{{ 'billing.concepts.' + invoice.concept | translate }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.createdAt' | translate }}</p>
                    <p>{{ invoice.createdAt | date : 'dd/MM/yyyy HH:mm' }}</p>
                  </div>
                  @if (invoice.issuedAt) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.issuedAt' | translate }}</p>
                      <p>{{ invoice.issuedAt | date : 'dd/MM/yyyy HH:mm' }}</p>
                    </div>
                  }
                  @if (invoice.cancelledAt) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.cancelledAt' | translate }}</p>
                      <p>{{ invoice.cancelledAt | date : 'dd/MM/yyyy HH:mm' }}</p>
                    </div>
                  }
                </div>
              </mat-card-content>
            </mat-card>

            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ 'billing.clientName' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="!p-6">
                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientName' | translate }}</p>
                    <p>{{ invoice.clientName }}</p>
                  </div>
                  @if (invoice.clientCuit) {
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientCuit' | translate }}</p>
                      <p class="font-mono">{{ invoice.clientCuit }}</p>
                    </div>
                  }
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientAddress' | translate }}</p>
                    <p>{{ invoice.clientAddress }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.clientIvaCondition' | translate }}</p>
                    <p>{{ 'billing.ivaConditions.' + invoice.clientIvaCondition | translate }}</p>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            @if (invoice.workOrder) {
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ 'billing.workOrder' | translate }}</mat-card-title>
                </mat-card-header>
                <mat-card-content class="!p-6">
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.code' | translate }}</p>
                      <p class="font-mono">{{ invoice.workOrder.trackingCode }}</p>
                    </div>
                    @if (invoice.workOrder.client) {
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.client' | translate }}</p>
                        <p>{{ invoice.workOrder.client.name }}</p>
                      </div>
                    }
                    @if (invoice.workOrder.serviceType) {
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.serviceType' | translate }}</p>
                        <p>{{ invoice.workOrder.serviceType.name }}</p>
                      </div>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>

          <div class="space-y-6">
            <mat-card>
              <mat-card-header>
                <mat-card-title>{{ 'billing.total' | translate }}</mat-card-title>
              </mat-card-header>
              <mat-card-content class="!p-6">
                <div class="space-y-3">
                  <div class="flex justify-between">
                    <span class="text-gray-500 dark:text-gray-400">{{ 'billing.subtotal' | translate }}</span>
                    <span>{{ invoice.subtotal | currencyArs }}</span>
                  </div>
                  @if (invoice.ivaAmount > 0) {
                    <div class="flex justify-between">
                      <span class="text-gray-500 dark:text-gray-400">{{ 'billing.ivaAmount' | translate }}</span>
                      <span>{{ invoice.ivaAmount | currencyArs }}</span>
                    </div>
                  }
                  <mat-divider />
                  <div class="flex justify-between text-lg font-bold">
                    <span>{{ 'billing.total' | translate }}</span>
                    <span>{{ invoice.total | currencyArs }}</span>
                  </div>
                </div>
              </mat-card-content>
            </mat-card>

            @if (invoice.cae) {
              <mat-card>
                <mat-card-header>
                  <mat-card-title>{{ 'billing.cae' | translate }}</mat-card-title>
                </mat-card-header>
                <mat-card-content class="!p-6">
                  <div class="space-y-3">
                    <div>
                      <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.cae' | translate }}</p>
                      <p class="font-mono text-lg">{{ invoice.cae }}</p>
                    </div>
                    @if (invoice.caeExpiry) {
                      <div>
                        <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'billing.caeExpiry' | translate }}</p>
                        <p>{{ invoice.caeExpiry | date : 'dd/MM/yyyy' }}</p>
                      </div>
                    }
                  </div>
                </mat-card-content>
              </mat-card>
            }
          </div>
        </div>
      }
    </div>
  `,
})
export class InvoiceDetailComponent {
  private readonly billingService = inject(BillingService);
  private readonly route = inject(ActivatedRoute);
  private readonly dialog = inject(MatDialog);

  readonly invoiceResource = httpResource<Invoice>(() => {
    const id = this.route.snapshot.paramMap.get('id');
    return id ? `/api/billing/invoices/${id}` : '';
  });

  issueInvoice(invoice: Invoice): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titleKey: 'billing.issueConfirmTitle',
        message: `¿Emitir factura ${invoice.invoiceNumber}? Se generará el CAE.`,
        confirmLabel: 'billing.issue',
        color: 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.billingService.issue(invoice.id).subscribe({
          next: () => this.invoiceResource.reload(),
        });
      }
    });
  }

  cancelInvoice(invoice: Invoice): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: {
        titleKey: 'billing.cancelConfirmTitle',
        message: `¿Anular factura ${invoice.invoiceNumber}? Esta acción no se puede deshacer.`,
        confirmLabel: 'billing.cancel',
        color: 'warn',
      },
    });

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.billingService.cancel(invoice.id).subscribe({
          next: () => this.invoiceResource.reload(),
        });
      }
    });
  }

  downloadPdf(invoice: Invoice): void {
    this.billingService.downloadPdf(invoice.id).subscribe((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `factura-${invoice.invoiceNumber}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      window.URL.revokeObjectURL(url);
    });
  }
}
