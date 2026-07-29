import { Component, inject, signal, computed } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { form, FormField, required } from '@angular/forms/signals';
import { BillingService } from '../../core/services/billing.service';
import { CreateInvoiceDto } from '../../core/models/api.interfaces';
import { Client, PaginatedResponse } from '../../core/models/client.interfaces';
import { WorkOrder } from '../../core/models/work-order.interfaces';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface InvoiceFormModel {
  invoiceType: string;
  concept: string;
  clientName: string;
  clientCuit: string;
  clientAddress: string;
  clientIvaCondition: string;
  subtotal: string;
  ivaAmount: string;
  total: string;
  workOrderDisplay: string;
}

@Component({
  selector: 'app-invoice-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    FormField,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>receipt</mat-icon>
      {{ 'billing.newInvoice' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <div class="space-y-4">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.invoiceType' | translate }}</mat-label>
            <mat-select [formField]="invoiceForm.invoiceType">
              <mat-option value="A">{{ 'billing.types.A' | translate }}</mat-option>
              <mat-option value="B">{{ 'billing.types.B' | translate }}</mat-option>
              <mat-option value="C">{{ 'billing.types.C' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.concept' | translate }}</mat-label>
            <mat-select [formField]="invoiceForm.concept">
              <mat-option value="services">{{ 'billing.concepts.services' | translate }}</mat-option>
              <mat-option value="products">{{ 'billing.concepts.products' | translate }}</mat-option>
              <mat-option value="both">{{ 'billing.concepts.both' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="relative">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.clientName' | translate }}</mat-label>
            <input
              matInput
              [formField]="invoiceForm.clientName"
              (input)="onClientSearch($any($event.target).value)"
              (focus)="showClientDropdown.set(true)"
              (blur)="hideClientDropdown()"
            />
            @if (invoiceForm.clientName().invalid() && invoiceForm.clientName().touched()) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>
          @if (showClientDropdown() && filteredClients().length > 0) {
            <div class="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              @for (client of filteredClients(); track client.id) {
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  (mousedown)="selectClient(client)"
                >
                  <span class="font-medium">{{ client.name }}</span>
                  <span class="text-gray-500 text-sm ml-2">{{ client.email }}</span>
                </button>
              }
            </div>
          }
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.clientCuit' | translate }}</mat-label>
            <input
              matInput
              [formField]="invoiceForm.clientCuit"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.clientIvaCondition' | translate }}</mat-label>
            <mat-select [formField]="invoiceForm.clientIvaCondition">
              <mat-option value="consumidor_final">{{ 'billing.ivaConditions.consumidorFinal' | translate }}</mat-option>
              <mat-option value="responsable_inscripto">{{ 'billing.ivaConditions.responsableInscripto' | translate }}</mat-option>
              <mat-option value="monotributo">{{ 'billing.ivaConditions.monotributo' | translate }}</mat-option>
              <mat-option value="exento">{{ 'billing.ivaConditions.exento' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'billing.clientAddress' | translate }}</mat-label>
          <input
            matInput
            [formField]="invoiceForm.clientAddress"
          />
          @if (invoiceForm.clientAddress().invalid() && invoiceForm.clientAddress().touched()) {
            <mat-error>{{ t('validation.required') }}</mat-error>
          }
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.subtotal' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [formField]="invoiceForm.subtotal"
              step="0.01"
            />
            @if (invoiceForm.subtotal().invalid() && invoiceForm.subtotal().touched()) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.ivaAmount' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [formField]="invoiceForm.ivaAmount"
              step="0.01"
            />
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.total' | translate }}</mat-label>
            <input
              matInput
              type="number"
              [formField]="invoiceForm.total"
              step="0.01"
            />
            @if (invoiceForm.total().invalid() && invoiceForm.total().touched()) {
              <mat-error>{{ t('validation.invalidAmount') }}</mat-error>
            }
          </mat-form-field>
        </div>

        <div class="relative">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'billing.workOrder' | translate }}</mat-label>
            <input
              matInput
              [formField]="invoiceForm.workOrderDisplay"
              (input)="onWorkOrderSearch($any($event.target).value)"
              (focus)="showWorkOrderDropdown.set(true)"
              (blur)="hideWorkOrderDropdown()"
            />
            @if (selectedWorkOrderId.length === 0 && invoiceForm.workOrderDisplay().touched()) {
              <mat-error>{{ t('validation.required') }}</mat-error>
            }
          </mat-form-field>
          @if (showWorkOrderDropdown() && filteredWorkOrders().length > 0) {
            <div class="absolute z-50 w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
              @for (wo of filteredWorkOrders(); track wo.id) {
                <button
                  type="button"
                  class="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  (mousedown)="selectWorkOrder(wo)"
                >
                  <span class="font-mono text-sm">{{ wo.trackingCode }}</span>
                  — {{ wo.client?.name ?? '' }}
                  @if (wo.serviceType) {
                    <span class="text-gray-500">({{ wo.serviceType.name }})</span>
                  }
                </button>
              }
            </div>
          }
        </div>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit()"
        [disabled]="saving() || invoiceForm().invalid()"
      >
        {{ saving() ? ('common.saving' | translate) : ('common.save' | translate) }}
      </button>
    </mat-dialog-actions>
  `,
})
export class InvoiceFormComponent {
  private readonly dialogRef = inject(MatDialogRef<InvoiceFormComponent>);
  private readonly billingService = inject(BillingService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  private readonly data = inject<Record<string, never>>(MAT_DIALOG_DATA);

  readonly selectedClientId = signal('');
  readonly selectedWorkOrderId = signal('');
  readonly saving = signal(false);
  readonly showClientDropdown = signal(false);
  readonly showWorkOrderDropdown = signal(false);

  readonly model = signal<InvoiceFormModel>({
    invoiceType: 'B',
    concept: 'services',
    clientName: '',
    clientCuit: '',
    clientAddress: '',
    clientIvaCondition: 'consumidor_final',
    subtotal: '',
    ivaAmount: '',
    total: '',
    workOrderDisplay: '',
  });
  readonly invoiceForm = form(this.model, (p) => {
    required(p.clientName, { message: 'validation.required' });
    required(p.clientAddress, { message: 'validation.required' });
    required(p.subtotal, { message: 'validation.invalidAmount' });
    required(p.total, { message: 'validation.invalidAmount' });
    required(p.workOrderDisplay, { message: 'validation.required' });
  });

  t(key: string): string {
    return this.translationService.instant(key);
  }

  private clientSearch = signal('');
  private workOrderSearch = signal('');

  readonly clientsResource = httpResource<PaginatedResponse<Client>>(
    () => {
      const term = this.clientSearch();
      if (!term || term.length < 2) return undefined;
      return { url: '/api/clients', params: { search: term, limit: '5' } };
    },
  );

  readonly workOrdersResource = httpResource<PaginatedResponse<WorkOrder>>(
    () => {
      const term = this.workOrderSearch();
      if (!term || term.length < 2) return undefined;
      return { url: '/api/work-orders', params: { search: term, limit: '10' } };
    },
  );

  readonly filteredClients = computed(() => {
    if (this.clientsResource.hasValue()) {
      return this.clientsResource.value().data;
    }
    return [];
  });

  readonly filteredWorkOrders = computed(() => {
    if (this.workOrdersResource.hasValue()) {
      return this.workOrdersResource.value().data;
    }
    return [];
  });

  private clientSearchTimer: ReturnType<typeof setTimeout> | null = null;
  private workOrderSearchTimer: ReturnType<typeof setTimeout> | null = null;

  onClientSearch(value: string): void {
    this.showClientDropdown.set(true);
    if (this.clientSearchTimer) clearTimeout(this.clientSearchTimer);
    this.clientSearchTimer = setTimeout(() => {
      this.clientSearch.set(value);
    }, 300);
  }

  hideClientDropdown(): void {
    setTimeout(() => this.showClientDropdown.set(false), 200);
  }

  selectClient(client: Client): void {
    this.selectedClientId.set(client.id);
    this.model.update(m => ({
      ...m,
      clientName: client.name,
      clientCuit: client.cuit ?? '',
      clientAddress: client.address ?? '',
      clientIvaCondition: client.ivaCondition || 'consumidor_final',
    }));
    this.showClientDropdown.set(false);
  }

  onWorkOrderSearch(value: string): void {
    this.showWorkOrderDropdown.set(true);
    if (this.workOrderSearchTimer) clearTimeout(this.workOrderSearchTimer);
    this.workOrderSearchTimer = setTimeout(() => {
      this.workOrderSearch.set(value);
    }, 300);
  }

  hideWorkOrderDropdown(): void {
    setTimeout(() => this.showWorkOrderDropdown.set(false), 200);
  }

  selectWorkOrder(wo: WorkOrder): void {
    this.selectedWorkOrderId.set(wo.id);
    this.model.update(m => ({ ...m, workOrderDisplay: wo.trackingCode }));
    this.showWorkOrderDropdown.set(false);
  }

  onSubmit(): void {
    if (this.invoiceForm().invalid()) return;

    this.saving.set(true);
    const m = this.model();

    const dto: CreateInvoiceDto = {
      invoiceType: m.invoiceType as 'A' | 'B' | 'C',
      concept: m.concept as 'products' | 'services' | 'both',
      clientName: m.clientName,
      clientCuit: m.clientCuit || undefined,
      clientAddress: m.clientAddress,
      clientIvaCondition: m.clientIvaCondition as any,
      subtotal: parseFloat(m.subtotal) || 0,
      ivaAmount: parseFloat(m.ivaAmount) || 0,
      total: parseFloat(m.total) || 0,
      workOrderId: this.selectedWorkOrderId(),
    };

    this.billingService.create(dto).subscribe({
      next: (invoice) => {
        this.saving.set(false);
        this.toastService.show(this.t('common.toast.created'), 'success');
        this.dialogRef.close(invoice);
      },
      error: (err) => {
        this.saving.set(false);
        console.error('Create invoice failed:', err);
        this.toastService.show(this.t('common.toast.errorCreated'), 'error');
      },
    });
  }
}
