import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { form, FormField, required } from '@angular/forms/signals';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { ClientsService } from '../../core/services/clients.service';
import { ServiceTypesService } from '../../core/services/service-types.service';
import {
  CreateWorkOrderDto,
  WorkOrderPriority,
  WorkOrderLocation,
} from '../../core/models/work-order.interfaces';
import { Client } from '../../core/models/client.interfaces';
import { ServiceType } from '../../core/models/service-type.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface DialogData {
  mode: 'create';
}

interface WorkOrderFormModel {
  clientId: string;
  serviceTypeId: string;
  priority: WorkOrderPriority;
  location: WorkOrderLocation;
  diagnosis: string;
  workAddress: string;
}

@Component({
  selector: 'app-work-order-form',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatAutocompleteModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    FormField,
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>assignment</mat-icon>
      {{ 'workOrders.newOrder' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.client' | translate }}</mat-label>
          <input
            matInput
            [value]="selectedClientName()"
            (input)="onClientSearch($event)"
            [matAutocomplete]="clientAuto"
          />
          @if (clientSearching()) {
            <mat-spinner matSuffix diameter="16" />
          }
          <mat-autocomplete
            #clientAuto="matAutocomplete"
            (optionSelected)="onClientSelected($event.option.value)"
          >
            @for (client of filteredClients(); track client.id) {
              <mat-option [value]="client.id">
                <div class="flex flex-col leading-tight">
                  <span class="font-medium">{{ client.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400">
                    {{ client.email }} · {{ client.phone }}
                  </span>
                </div>
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.serviceType' | translate }}</mat-label>
          <mat-select [formField]="workOrderForm.serviceTypeId">
            @for (serviceType of serviceTypes(); track serviceType.id) {
              <mat-option [value]="serviceType.id">
                {{ serviceType.name }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.priority' | translate }}</mat-label>
            <mat-select [formField]="workOrderForm.priority">
              <mat-option value="low">{{ 'workOrders.priorities.low' | translate }}</mat-option>
              <mat-option value="medium">{{
                'workOrders.priorities.medium' | translate
              }}</mat-option>
              <mat-option value="high">{{ 'workOrders.priorities.high' | translate }}</mat-option>
              <mat-option value="urgent">{{
                'workOrders.priorities.urgent' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.location' | translate }}</mat-label>
            <mat-select [formField]="workOrderForm.location">
              <mat-option value="workshop">{{
                'workOrders.locations.workshop' | translate
              }}</mat-option>
              <mat-option value="on_site">{{
                'workOrders.locations.onSite' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.scheduledDate' | translate }}</mat-label>
          <input
            matInput
            [matDatepicker]="scheduledPicker"
            [value]="scheduledDateValue()"
            (dateChange)="onScheduledDateChange($event)"
            (click)="scheduledPicker.open()"
          />
          <mat-datepicker-toggle matIconSuffix [for]="scheduledPicker"></mat-datepicker-toggle>
          <mat-datepicker #scheduledPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.warrantyUntil' | translate }}</mat-label>
          <input
            matInput
            [matDatepicker]="warrantyPicker"
            [value]="warrantyUntilValue()"
            (dateChange)="onWarrantyUntilChange($event)"
            (click)="warrantyPicker.open()"
          />
          <mat-datepicker-toggle matIconSuffix [for]="warrantyPicker"></mat-datepicker-toggle>
          <mat-datepicker #warrantyPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.initialDiagnosis' | translate }}</mat-label>
          <textarea matInput [formField]="workOrderForm.diagnosis" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.workAddress' | translate }}</mat-label>
          <input
            matInput
            #workAddressInput
            [formField]="workOrderForm.workAddress"
            [placeholder]="'workOrders.workAddressPlaceholder' | translate"
          />
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="saving()">
        {{
          saving() ? ('workOrders.creating' | translate) : ('workOrders.createOrder' | translate)
        }}
      </button>
    </mat-dialog-actions>
  `,
})
export class WorkOrderFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<WorkOrderFormComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly clientsService = inject(ClientsService);
  private readonly serviceTypesService = inject(ServiceTypesService);

  readonly clients = signal<Client[]>([]);
  readonly serviceTypes = signal<ServiceType[]>([]);
  readonly filteredClients = signal<Client[]>([]);
  readonly selectedClientName = signal('');
  readonly clientSearching = signal(false);

  readonly scheduledDate = signal('');
  readonly warrantyUntil = signal('');
  readonly saving = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<WorkOrderFormModel>({
    clientId: '',
    serviceTypeId: '',
    priority: 'medium',
    location: 'workshop',
    diagnosis: '',
    workAddress: '',
  });
  readonly workOrderForm = form(this.model, (p) => {
    required(p.clientId);
    required(p.serviceTypeId);
  });

  ngOnInit(): void {
    this.clientsService.getAll({ limit: 20 }).subscribe({
      next: (data) => {
        this.clients.set(data.data);
        this.filteredClients.set(data.data);
      },
    });

    this.serviceTypesService.getAll({ limit: 100 }).subscribe({
      next: (data) => this.serviceTypes.set(data.data),
    });
  }

  onClientSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedClientName.set(value);
    this.model.update((m) => ({ ...m, clientId: '' }));

    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => {
      this.clientSearching.set(true);
      this.clientsService.getAll({ search: value, limit: 20 }).subscribe({
        next: (data) => {
          this.filteredClients.set(data.data);
          this.clientSearching.set(false);
        },
        error: () => this.clientSearching.set(false),
      });
    }, 300);
  }

  onClientSelected(clientId: string): void {
    this.model.update((m) => ({ ...m, clientId }));
    const client = this.filteredClients().find((c) => c.id === clientId);
    if (client) {
      this.selectedClientName.set(client.name);
      if (client.address && !this.model().workAddress) {
        this.model.update((m) => ({ ...m, workAddress: client.address }));
      }
    }
  }

  scheduledDateValue(): Date | null {
    const v = this.scheduledDate();
    return v ? new Date(v) : null;
  }

  warrantyUntilValue(): Date | null {
    const v = this.warrantyUntil();
    return v ? new Date(v) : null;
  }

  onScheduledDateChange(event: { value: Date | null }): void {
    this.scheduledDate.set(event.value ? toLocalDateString(event.value) : '');
  }

  onWarrantyUntilChange(event: { value: Date | null }): void {
    this.warrantyUntil.set(event.value ? toLocalDateString(event.value) : '');
  }

  onSubmit(): void {
    if (!this.model().clientId || !this.model().serviceTypeId) return;

    this.saving.set(true);
    const m = this.model();

    const dto: CreateWorkOrderDto = {
      clientId: m.clientId,
      serviceTypeId: m.serviceTypeId,
      priority: m.priority,
      location: m.location,
      scheduledDate: this.scheduledDate() || undefined,
      warrantyUntil: this.warrantyUntil() || undefined,
      diagnosis: m.diagnosis || undefined,
      workAddress: m.workAddress || undefined,
    };

    this.workOrdersService.create(dto).subscribe({
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
