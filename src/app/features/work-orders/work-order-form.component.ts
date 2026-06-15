import { Component, inject, signal, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
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
    TranslatePipe,
  ],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>assignment</mat-icon>
      {{ 'workOrders.newOrder' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.client' | translate }}</mat-label>
          <mat-select [value]="clientId()" (selectionChange)="clientId.set($event.value)">
            @for (client of clients(); track client.id) {
              <mat-option [value]="client.id">
                {{ client.name }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.serviceType' | translate }}</mat-label>
          <mat-select [value]="serviceTypeId()" (selectionChange)="serviceTypeId.set($event.value)">
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
            <mat-select [value]="priority()" (selectionChange)="priority.set($event.value)">
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
            <mat-select [value]="location()" (selectionChange)="location.set($event.value)">
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
            type="date"
            [value]="scheduledDate()"
            (input)="scheduledDate.set(getInputValue($event))"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.warrantyUntil' | translate }}</mat-label>
          <input
            matInput
            type="date"
            [value]="warrantyUntil()"
            (input)="warrantyUntil.set(getInputValue($event))"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.initialDiagnosis' | translate }}</mat-label>
          <textarea
            matInput
            [value]="diagnosis()"
            (input)="diagnosis.set(getInputValue($event))"
            rows="3"
          ></textarea>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
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

  readonly clientId = signal('');
  readonly serviceTypeId = signal('');
  readonly priority = signal<WorkOrderPriority>('medium');
  readonly location = signal<WorkOrderLocation>('workshop');
  readonly scheduledDate = signal('');
  readonly warrantyUntil = signal('');
  readonly diagnosis = signal('');
  readonly saving = signal(false);

  ngOnInit(): void {
    this.clientsService.getAll({ limit: 100 }).subscribe({
      next: (response) => this.clients.set(response.data),
    });

    this.serviceTypesService.getAll({ limit: 100 }).subscribe({
      next: (response) => this.serviceTypes.set(response.data),
    });
  }

  getInputValue(event: Event): string {
    return (event.target as HTMLInputElement).value;
  }

  onSubmit(event: Event): void {
    event.preventDefault();
    this.saving.set(true);

    const dto: CreateWorkOrderDto = {
      clientId: this.clientId(),
      serviceTypeId: this.serviceTypeId(),
      priority: this.priority(),
      location: this.location(),
      scheduledDate: this.scheduledDate() || undefined,
      warrantyUntil: this.warrantyUntil() || undefined,
      diagnosis: this.diagnosis() || undefined,
    };

    this.workOrdersService.create(dto).subscribe({
      next: (workOrder) => {
        this.saving.set(false);
        this.dialogRef.close(workOrder);
      },
      error: () => {
        this.saving.set(false);
      },
    });
  }
}
