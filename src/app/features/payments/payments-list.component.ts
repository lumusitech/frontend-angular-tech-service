import { Component, inject, signal } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { PaymentsService } from '../../core/services/payments.service';
import { Payment, PaymentStatus, PaymentMethod } from '../../core/models/payment.interfaces';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { EmptyStateComponent } from '../../shared/components/empty-state/empty-state.component';
import { DatePipe, CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-payments-list',
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatButtonModule,
    MatSelectModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    EmptyStateComponent,
    DatePipe,
    CurrencyPipe,
  ],
  template: `
    <div class="space-y-4">
      <div class="flex items-center justify-between">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Pagos</h1>
          <p class="text-gray-500 mt-1">Historial de pagos del sistema</p>
        </div>
      </div>

      <div class="flex gap-3 flex-wrap">
        <mat-form-field appearance="outline" class="w-40">
          <mat-label>Estado</mat-label>
          <mat-select [value]="statusFilter()" (selectionChange)="statusFilter.set($event.value)">
            <mat-option>Todos</mat-option>
            <mat-option value="pending">Pendiente</mat-option>
            <mat-option value="approved">Aprobado</mat-option>
            <mat-option value="rejected">Rechazado</mat-option>
            <mat-option value="refunded">Reembolsado</mat-option>
            <mat-option value="cancelled">Cancelado</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-40">
          <mat-label>Método</mat-label>
          <mat-select [value]="methodFilter()" (selectionChange)="methodFilter.set($event.value)">
            <mat-option>Todos</mat-option>
            <mat-option value="cash">Efectivo</mat-option>
            <mat-option value="transfer">Transferencia</mat-option>
            <mat-option value="credit_card">Tarjeta Crédito</mat-option>
            <mat-option value="debit_card">Tarjeta Débito</mat-option>
          </mat-select>
        </mat-form-field>
      </div>

      @if (paymentsResource.isLoading()) {
        <div class="flex justify-center py-12">
          <mat-spinner diameter="48" />
        </div>
      } @else if (paymentsResource.hasValue() && paymentsResource.value().data.length === 0) {
        <app-empty-state title="Sin pagos" message="No hay pagos registrados en el sistema." />
      } @else if (paymentsResource.hasValue()) {
        <div class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <table mat-table [dataSource]="paymentsResource.value().data" class="w-full">
            <ng-container matColumnDef="trackingCode">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Orden
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3">
                <span class="font-mono text-sm font-medium text-blue-600">{{
                  payment.workOrder.trackingCode
                }}</span>
              </td>
            </ng-container>

            <ng-container matColumnDef="amount">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Monto
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm font-medium">
                {{ payment.amount | currency: 'ARS' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="method">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Método
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm text-gray-500">
                {{ getMethodLabel(payment.method) }}
              </td>
            </ng-container>

            <ng-container matColumnDef="provider">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Proveedor
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm text-gray-500">
                {{ payment.provider }}
              </td>
            </ng-container>

            <ng-container matColumnDef="status">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Estado
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3">
                <span
                  class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                  [class]="getStatusClass(payment.status)"
                >
                  {{ getStatusLabel(payment.status) }}
                </span>
              </td>
            </ng-container>

            <ng-container matColumnDef="paidAt">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase"
              >
                Fecha Pago
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-sm text-gray-500">
                {{ payment.paidAt ? (payment.paidAt | date: 'dd/MM/yyyy HH:mm') : '-' }}
              </td>
            </ng-container>

            <ng-container matColumnDef="actions">
              <th
                mat-header-cell
                *matHeaderCellDef
                class="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase"
              >
                Acciones
              </th>
              <td mat-cell *matCellDef="let payment" class="px-4 py-3 text-right">
                @if (payment.status === 'pending') {
                  <button
                    mat-icon-button
                    (click)="approvePayment(payment)"
                    title="Aprobar"
                    color="primary"
                  >
                    <mat-icon>check_circle</mat-icon>
                  </button>
                }
              </td>
            </ng-container>

            <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
            <tr mat-row *matRowDef="let row; columns: displayedColumns"></tr>
          </table>

          <mat-paginator
            [length]="paymentsResource.value().total"
            [pageSize]="pageSize()"
            [pageSizeOptions]="[10, 25, 50]"
            (page)="onPageChange($event)"
            showFirstLastButtons
          />
        </div>
      }
    </div>
  `,
})
export class PaymentsListComponent {
  private readonly paymentsService = inject(PaymentsService);

  readonly pageSize = signal(10);
  readonly currentPage = signal(1);
  readonly statusFilter = signal<PaymentStatus | ''>('');
  readonly methodFilter = signal<PaymentMethod | ''>('');

  readonly paymentsResource = httpResource<PaginatedResponse<Payment>>(
    () =>
      `/api/payments?page=${this.currentPage()}&limit=${this.pageSize()}&status=${this.statusFilter()}&method=${this.methodFilter()}`,
  );

  displayedColumns = [
    'trackingCode',
    'amount',
    'method',
    'provider',
    'status',
    'paidAt',
    'actions',
  ];

  onPageChange(event: PageEvent): void {
    this.currentPage.set(event.pageIndex + 1);
    this.pageSize.set(event.pageSize);
  }

  approvePayment(payment: Payment): void {
    this.paymentsService
      .update(payment.id, {
        status: 'approved',
        paidAt: new Date().toISOString(),
      })
      .subscribe({
        next: () => this.paymentsResource.reload(),
      });
  }

  getStatusClass(status: PaymentStatus): string {
    const classes: Record<PaymentStatus, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      refunded: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-gray-100 text-gray-800',
    };
    return classes[status] || 'bg-gray-100 text-gray-800';
  }

  getStatusLabel(status: PaymentStatus): string {
    const labels: Record<PaymentStatus, string> = {
      pending: 'Pendiente',
      approved: 'Aprobado',
      rejected: 'Rechazado',
      refunded: 'Reembolsado',
      cancelled: 'Cancelado',
    };
    return labels[status] || status;
  }

  getMethodLabel(method: PaymentMethod): string {
    const labels: Record<PaymentMethod, string> = {
      cash: 'Efectivo',
      transfer: 'Transferencia',
      credit_card: 'Tarjeta Crédito',
      debit_card: 'Tarjeta Débito',
    };
    return labels[method] || method;
  }
}
