import { Component, inject, input, output, signal } from '@angular/core';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ClientsService } from '../../../core/services/clients.service';
import { ServiceTypesService } from '../../../core/services/service-types.service';
import { Client } from '../../../core/models/client.interfaces';
import { ServiceType } from '../../../core/models/service-type.interfaces';
import {
  WorkOrder,
  WorkOrderPriority,
  WorkOrderLocation,
  UpdateWorkOrderDto,
} from '../../../core/models/work-order.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';

@Component({
  selector: 'app-info-tab',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatProgressSpinnerModule,
    TranslatePipe,
  ],
  template: `
    <div class="p-4 space-y-4">
      @if (editable() && editMode()) {
        <!-- Edit mode -->
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.client' | translate }}</mat-label>
          <mat-select [value]="editClientId()" (selectionChange)="onClientChange($event.value)">
            @for (c of clients(); track c.id) {
              <mat-option [value]="c.id">{{ c.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.serviceType' | translate }}</mat-label>
          <mat-select [value]="editServiceTypeId()" (selectionChange)="editServiceTypeId.set($event.value)">
            @for (st of serviceTypes(); track st.id) {
              <mat-option [value]="st.id">{{ st.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.detail.location' | translate }}</mat-label>
            <mat-select [value]="editLocation()" (selectionChange)="editLocation.set($event.value)">
              <mat-option value="workshop">{{ 'workOrders.locations.workshop' | translate }}</mat-option>
              <mat-option value="on_site">{{ 'workOrders.locations.onSite' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.workAddress' | translate }}</mat-label>
            <input matInput [value]="editWorkAddress()" (input)="editWorkAddress.set(getValue($event))" />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.detail.scheduledDate' | translate }}</mat-label>
            <input matInput [matDatepicker]="scheduledPicker" [value]="editScheduledDate()" (dateChange)="editScheduledDate.set($any($event).value)" />
            <mat-datepicker-toggle matIconSuffix [for]="scheduledPicker"></mat-datepicker-toggle>
            <mat-datepicker #scheduledPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.detail.warrantyUntil' | translate }}</mat-label>
            <input matInput [matDatepicker]="warrantyPicker" [value]="editWarrantyUntil()" (dateChange)="editWarrantyUntil.set($any($event).value)" />
            <mat-datepicker-toggle matIconSuffix [for]="warrantyPicker"></mat-datepicker-toggle>
            <mat-datepicker #warrantyPicker></mat-datepicker>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.detail.diagnosis' | translate }}</mat-label>
          <textarea matInput rows="3" [value]="editDiagnosis()" (input)="editDiagnosis.set(getValue($event))"></textarea>
        </mat-form-field>
        <div class="flex gap-2 justify-end">
          <button mat-button (click)="cancelEdit()">{{ 'common.cancel' | translate }}</button>
          <button mat-flat-button color="primary" (click)="save()" [disabled]="saving()">
            @if (saving()) {
              <mat-spinner diameter="16" class="inline-block mr-1" />
            }
            {{ 'common.save' | translate }}
          </button>
        </div>
      } @else {
        <!-- View mode -->
        <div class="flex justify-end">
          @if (editable()) {
            <button mat-button color="primary" (click)="startEdit()">
              <mat-icon>edit</mat-icon>
              {{ 'common.edit' | translate }}
            </button>
          }
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.detail.client' | translate }}</p>
            <p class="font-medium">{{ workOrder().client.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ workOrder().client.email }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ workOrder().client.phone }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.detail.location' | translate }}</p>
            <p class="font-medium">
              {{ workOrder().location === 'workshop' ? ('workOrders.locations.workshop' | translate) : ('workOrders.locations.onSite' | translate) }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.workAddress' | translate }}</p>
            <p class="font-medium">{{ workOrder().workAddress || '-' }}</p>
          </div>
          @if (workOrder().client.address && workOrder().workAddress && workOrder().client.address !== workOrder().workAddress) {
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'common.address' | translate }} {{ 'workOrders.detail.client' | translate }}</p>
              <p class="font-medium">{{ workOrder().client.address }}</p>
            </div>
          }
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.detail.scheduledDate' | translate }}</p>
            <p class="font-medium">{{ workOrder().scheduledDate ? (workOrder().scheduledDate | date: 'dd/MM/yyyy') : '-' }}</p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.detail.warrantyUntil' | translate }}</p>
            <p class="font-medium">{{ workOrder().warrantyUntil ? (workOrder().warrantyUntil | date: 'dd/MM/yyyy') : '-' }}</p>
          </div>
        </div>
        @if (workOrder().diagnosis) {
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ 'workOrders.detail.diagnosis' | translate }}</p>
            <p class="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">{{ workOrder().diagnosis }}</p>
          </div>
        }
      }
    </div>
  `,
})
export class InfoTabComponent {
  private readonly clientsService = inject(ClientsService);
  private readonly serviceTypesService = inject(ServiceTypesService);

  workOrder = input.required<WorkOrder>();
  editable = input(false);
  saving = input(false);

  saved = output<UpdateWorkOrderDto>();

  readonly clients = signal<Client[]>([]);
  readonly serviceTypes = signal<ServiceType[]>([]);

  readonly editMode = signal(false);

  readonly editClientId = signal('');
  readonly editServiceTypeId = signal('');
  readonly editDiagnosis = signal('');
  readonly editWorkAddress = signal('');
  readonly editScheduledDate = signal<Date | null>(null);
  readonly editWarrantyUntil = signal<Date | null>(null);
  readonly editLocation = signal<WorkOrderLocation>('workshop');

  startEdit(): void {
    const wo = this.workOrder();
    this.editClientId.set(wo.client?.id || wo.clientId || '');
    this.editServiceTypeId.set(wo.serviceType?.id || wo.serviceTypeId || '');
    this.editDiagnosis.set(wo.diagnosis || '');
    this.editWorkAddress.set(wo.workAddress || '');
    this.editScheduledDate.set(wo.scheduledDate ? new Date(wo.scheduledDate) : null);
    this.editWarrantyUntil.set(wo.warrantyUntil ? new Date(wo.warrantyUntil) : null);
    this.editLocation.set(wo.location || 'workshop');
    this.editMode.set(true);

    this.clientsService.getAll({ limit: 100 }).subscribe({
      next: (data) => this.clients.set(data.data),
    });

    this.serviceTypesService.getAll({ limit: 100 }).subscribe({
      next: (data) => this.serviceTypes.set(data.data),
    });
  }

  onClientChange(clientId: string): void {
    this.editClientId.set(clientId);
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }

  save(): void {
    const dto: UpdateWorkOrderDto = {};
    const wo = this.workOrder();

    const clientId = this.editClientId();
    if (clientId !== (wo.client?.id || wo.clientId)) dto.clientId = clientId;

    const serviceTypeId = this.editServiceTypeId();
    if (serviceTypeId !== (wo.serviceType?.id || wo.serviceTypeId)) dto.serviceTypeId = serviceTypeId;

    const diagnosis = this.editDiagnosis().trim();
    if (diagnosis !== (wo.diagnosis || '')) dto.diagnosis = diagnosis || undefined;

    const workAddress = this.editWorkAddress().trim();
    if (workAddress !== (wo.workAddress || '')) dto.workAddress = workAddress || undefined;

    const scheduledDate = this.editScheduledDate();
    const scheduledStr = scheduledDate ? scheduledDate.toISOString().split('T')[0] : null;
    if (scheduledStr !== (wo.scheduledDate || null)) dto.scheduledDate = scheduledStr || undefined;

    const warrantyUntil = this.editWarrantyUntil();
    const warrantyStr = warrantyUntil ? warrantyUntil.toISOString().split('T')[0] : null;
    if (warrantyStr !== (wo.warrantyUntil || null)) dto.warrantyUntil = warrantyStr || undefined;

    const location = this.editLocation();
    if (location !== wo.location) dto.location = location;

    if (Object.keys(dto).length === 0) {
      this.editMode.set(false);
      return;
    }

    this.saved.emit(dto);
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }
}
