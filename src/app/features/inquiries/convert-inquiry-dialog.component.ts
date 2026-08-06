import { Component, inject, signal, OnInit } from '@angular/core';
import { toLocalDateString } from '../../core/utils/date.utils';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { form, FormField, required } from '@angular/forms/signals';
import { InquiriesService } from '../../core/services/inquiries.service';
import { ClientsService } from '../../core/services/clients.service';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { ToastService } from '../../core/services/toast.service';
import { TranslationService } from '../../core/services/translation.service';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import {
  Inquiry,
  ConvertInquiryDto,
} from '../../core/models/inquiry.interfaces';
import { CreateClientDto, Client } from '../../core/models/client.interfaces';
import { ServiceType } from '../../core/models/service-type.interfaces';
import {
  WorkOrderPriority,
  WorkOrderLocation,
} from '../../core/models/work-order.interfaces';

interface DialogData {
  inquiry: Inquiry;
}

type ClientMode = 'new' | 'existing';

interface ConvertFormModel {
  serviceTypeId: string;
  priority: WorkOrderPriority;
  location: WorkOrderLocation;
  diagnosis: string;
  workAddress: string;
}

interface NewClientModel {
  name: string;
  email: string;
  phone: string;
  address: string;
}

@Component({
  selector: 'app-convert-inquiry-dialog',
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCardModule,
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
      <mat-icon>construction</mat-icon>
      {{ 'inquiries.convertTitle' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <div class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'inquiries.convertClientMode' | translate }}</mat-label>
          <mat-select [value]="clientMode()" (selectionChange)="onClientModeChange($event.value)">
            <mat-option value="new">{{ 'inquiries.clientModeNew' | translate }}</mat-option>
            <mat-option value="existing">{{ 'inquiries.clientModeExisting' | translate }}</mat-option>
          </mat-select>
        </mat-form-field>

        @if (clientMode() === 'new') {
          <mat-card class="!p-4">
            <h3 class="text-sm font-medium text-gray-900 dark:text-gray-100 mb-3">
              <mat-icon class="mr-1 align-middle text-sm">person_add</mat-icon>
              {{ 'inquiries.newClientData' | translate }}
            </h3>
            <div class="space-y-4">
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>{{ 'inquiries.clientName' | translate }}</mat-label>
                <input matInput [formField]="newClientForm.name" />
              </mat-form-field>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{ 'inquiries.email' | translate }}</mat-label>
                  <input matInput [formField]="newClientForm.email" />
                </mat-form-field>
                <mat-form-field appearance="outline" class="w-full">
                  <mat-label>{{ 'inquiries.phone' | translate }}</mat-label>
                  <input matInput [formField]="newClientForm.phone" />
                </mat-form-field>
              </div>
              <mat-form-field appearance="outline" class="w-full">
                <mat-label>{{ 'inquiries.address' | translate }}</mat-label>
                <input matInput [formField]="newClientForm.address" />
              </mat-form-field>
            </div>
          </mat-card>
        } @else {
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
        }

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.serviceType' | translate }}</mat-label>
          <mat-select [formField]="convertForm.serviceTypeId">
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
            <mat-select [formField]="convertForm.priority">
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
            <mat-select [formField]="convertForm.location">
              <mat-option value="workshop">{{
                'workOrders.locations.workshop' | translate
              }}</mat-option>
              <mat-option value="on_site">{{
                'workOrders.locations.onSite' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.initialDiagnosis' | translate }}</mat-label>
          <textarea matInput [formField]="convertForm.diagnosis" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.workAddress' | translate }}</mat-label>
          <input
            matInput
            [formField]="convertForm.workAddress"
            [placeholder]="'workOrders.workAddressPlaceholder' | translate"
          />
        </mat-form-field>
      </div>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit()" [disabled]="saving()">
        {{
          saving() ? ('workOrders.creating' | translate) : ('inquiries.convert' | translate)
        }}
      </button>
    </mat-dialog-actions>
  `,
})
export class ConvertInquiryDialogComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ConvertInquiryDialogComponent>);
  private readonly inquiriesService = inject(InquiriesService);
  private readonly clientsService = inject(ClientsService);
  private readonly serviceTypesService = inject(ServiceTypesService);
  private readonly toastService = inject(ToastService);
  private readonly translationService = inject(TranslationService);
  readonly data = inject<DialogData>(MAT_DIALOG_DATA);

  readonly clientMode = signal<ClientMode>('new');

  readonly serviceTypes = signal<ServiceType[]>([]);
  readonly clients = signal<Client[]>([]);
  readonly filteredClients = signal<Client[]>([]);
  readonly selectedClientName = signal('');
  readonly clientSearching = signal(false);
  private existingClientId = '';

  readonly scheduledDate = signal('');
  readonly warrantyUntil = signal('');
  readonly saving = signal(false);

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly model = signal<ConvertFormModel>({
    serviceTypeId: '',
    priority: 'medium',
    location: 'workshop',
    diagnosis: this.data.inquiry.description,
    workAddress: this.data.inquiry.clientAddress ?? '',
  });
  readonly convertForm = form(this.model, (p) => {
    required(p.serviceTypeId);
  });

  readonly newClientModel = signal<NewClientModel>({
    name: this.data.inquiry.clientName,
    email: this.data.inquiry.clientEmail ?? '',
    phone: this.data.inquiry.clientPhone ?? '',
    address: this.data.inquiry.clientAddress ?? '',
  });
  readonly newClientForm = form(this.newClientModel, (p) => {
    required(p.name);
    required(p.email);
    required(p.phone);
  });

  t(key: string): string {
    return this.translationService.instant(key);
  }

  ngOnInit(): void {
    this.serviceTypesService.getAll({ limit: 100 }).subscribe({
      next: (data) => this.serviceTypes.set(data.data),
    });

    this.clientsService.getAll({ limit: 20 }).subscribe({
      next: (data) => {
        this.clients.set(data.data);
        this.filteredClients.set(data.data);
      },
    });
  }

  onClientModeChange(mode: ClientMode): void {
    this.clientMode.set(mode);
    this.existingClientId = '';
    this.selectedClientName.set('');
  }

  onClientSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedClientName.set(value);
    this.existingClientId = '';

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
    this.existingClientId = clientId;
    const client = this.filteredClients().find((c) => c.id === clientId);
    if (client) this.selectedClientName.set(client.name);
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
    if (!this.model().serviceTypeId) return;

    let clientId: string;
    if (this.clientMode() === 'existing') {
      if (!this.existingClientId) return;
      clientId = this.existingClientId;
    } else {
      if (this.newClientForm().invalid()) return;
      clientId = '';
      const nc = this.newClientModel();
      const dto: CreateClientDto = {
        name: nc.name,
        email: nc.email,
        phone: nc.phone,
        address: nc.address,
      };
      this.saving.set(true);
      this.clientsService.create(dto).subscribe({
        next: (client) => {
          this.finishConvert(client.id);
        },
        error: () => {
          this.saving.set(false);
          this.toastService.show(this.t('common.toast.errorCreated'), 'error');
        },
      });
      return;
    }

    this.saving.set(true);
    this.finishConvert(clientId);
  }

  private finishConvert(clientId: string): void {
    const m = this.model();
    const dto: ConvertInquiryDto = {
      clientId,
      serviceTypeId: m.serviceTypeId,
      priority: m.priority,
      location: m.location,
      diagnosis: m.diagnosis || undefined,
      workAddress: m.workAddress || undefined,
      scheduledDate: this.scheduledDate() || undefined,
      warrantyUntil: this.warrantyUntil() || undefined,
    };

    this.inquiriesService.convert(this.data.inquiry.id, dto).subscribe({
      next: () => {
        this.saving.set(false);
        this.toastService.show(this.t('common.toast.created'), 'success');
        this.dialogRef.close(true);
      },
      error: () => {
        this.saving.set(false);
        this.toastService.show(this.t('common.toast.errorCreated'), 'error');
      },
    });
  }
}
