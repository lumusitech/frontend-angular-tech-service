import { Component, inject, input, output, signal, OnInit } from '@angular/core';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Client } from '../../../core/models/client.interfaces';
import { ClientsService } from '../../../core/services/clients.service';
import { ServiceType } from '../../../core/models/service-type.interfaces';
import { PaginatedResponse } from '../../../core/models/dashboard.interfaces';
import {
  WorkOrder,
  WorkOrderLocation,
  UpdateWorkOrderDto,
} from '../../../core/models/work-order.interfaces';
import { TranslatePipe } from '../../../shared/pipes/translate.pipe';
import { toLocalDateString } from '../../../core/utils/date.utils';

@Component({
  selector: 'app-info-tab',
  imports: [
    DatePipe,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatAutocompleteModule,
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
          <input
            matInput
            [matAutocomplete]="clientAuto"
            [value]="selectedClientName()"
            (input)="onClientSearch($event)"
            (focus)="onClientFocus()"
          />
          @if (clientSearching()) {
            <mat-spinner matSuffix diameter="16" />
          }
          <mat-autocomplete
            #clientAuto="matAutocomplete"
            (optionSelected)="onClientSelected($event.option.value)"
          >
            @for (c of filteredClients(); track c.id) {
              <mat-option [value]="c.id">
                <div class="flex flex-col leading-tight">
                  <span class="font-medium">{{ c.name }}</span>
                  <span class="text-xs text-gray-500 dark:text-gray-400"
                    >{{ c.email }} · {{ c.phone }}</span
                  >
                </div>
              </mat-option>
            }
          </mat-autocomplete>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.serviceType' | translate }}</mat-label>
          <mat-select
            [value]="editServiceTypeId()"
            (selectionChange)="editServiceTypeId.set($event.value)"
          >
            @for (st of serviceTypes(); track st.id) {
              <mat-option [value]="st.id">{{ st.name }}</mat-option>
            }
          </mat-select>
        </mat-form-field>

        <div class="grid grid-cols-2 gap-4">
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.detail.location' | translate }}</mat-label>
            <mat-select [value]="editLocation()" (selectionChange)="editLocation.set($event.value)">
              <mat-option value="workshop">{{
                'workOrders.locations.workshop' | translate
              }}</mat-option>
              <mat-option value="on_site">{{
                'workOrders.locations.onSite' | translate
              }}</mat-option>
            </mat-select>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.workAddress' | translate }}</mat-label>
            <input
              matInput
              [value]="editWorkAddress()"
              (input)="editWorkAddress.set(getValue($event))"
            />
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.detail.scheduledDate' | translate }}</mat-label>
            <input
              matInput
              [matDatepicker]="scheduledPicker"
              [value]="editScheduledDate()"
              (dateChange)="editScheduledDate.set($any($event).value)"
            />
            <mat-datepicker-toggle matIconSuffix [for]="scheduledPicker"></mat-datepicker-toggle>
            <mat-datepicker #scheduledPicker></mat-datepicker>
          </mat-form-field>
          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.detail.warrantyUntil' | translate }}</mat-label>
            <input
              matInput
              [matDatepicker]="warrantyPicker"
              [value]="editWarrantyUntil()"
              (dateChange)="editWarrantyUntil.set($any($event).value)"
            />
            <mat-datepicker-toggle matIconSuffix [for]="warrantyPicker"></mat-datepicker-toggle>
            <mat-datepicker #warrantyPicker></mat-datepicker>
          </mat-form-field>
        </div>
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.detail.diagnosis' | translate }}</mat-label>
          <textarea
            matInput
            rows="3"
            [value]="editDiagnosis()"
            (input)="editDiagnosis.set(getValue($event))"
          ></textarea>
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
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.client' | translate }}
            </p>
            <p class="font-medium">{{ workOrder().client.name }}</p>
            <p class="text-sm text-gray-500 dark:text-gray-400">{{ workOrder().client.email }}</p>
            <div class="flex items-center gap-1.5 flex-wrap">
              <a
                [href]="'tel:' + workOrder().client.phone"
                class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
              >
                {{ workOrder().client.phone }}
              </a>
              @if (workOrder().client.phone) {
                <a
                  [href]="'tel:' + workOrder().client.phone"
                  class="inline-flex items-center justify-center p-1 rounded-md bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                  [title]="'common.call' | translate"
                >
                  <mat-icon class="w-3.5! h-3.5! text-xs!">call</mat-icon>
                </a>
                <a
                  [href]="'https://wa.me/' + encodeURIComponent(workOrder().client.phone)"
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center p-1 rounded-md bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-colors"
                  [title]="'common.whatsapp' | translate"
                >
                  <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c0-5.445 4.43-9.874 9.875-9.874 2.637 0 5.115 1.028 6.978 2.894A9.827 9.827 0 0121.996 12c0 5.447-4.429 9.875-9.875 9.875m0-18c-6.52 0-11.82 5.3-11.82 11.82 0 2.09.544 4.13 1.579 5.92L0 24l6.452-1.69a11.78 11.78 0 005.597 1.41h.005c6.519 0 11.82-5.3 11.82-11.82 0-3.16-1.23-6.13-3.463-8.363A11.754 11.754 0 0012.05 1z"/>
                  </svg>
                </a>
              }
            </div>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.location' | translate }}
            </p>
            <p class="font-medium">
              {{
                workOrder().location === 'workshop'
                  ? ('workOrders.locations.workshop' | translate)
                  : ('workOrders.locations.onSite' | translate)
              }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'workOrders.workAddress' | translate }}
            </p>
            <div class="flex items-center gap-1.5 flex-wrap">
              @if (workOrder().workAddress) {
                <a
                  [href]="
                    'https://maps.google.com/?q=' + encodeURIComponent(workOrder().workAddress!)
                  "
                  target="_blank"
                  rel="noopener"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ workOrder().workAddress }}
                </a>
                <a
                  [href]="
                    'https://maps.google.com/?q=' + encodeURIComponent(workOrder().workAddress!)
                  "
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center p-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                  [title]="'common.openInMaps' | translate"
                >
                  <mat-icon class="w-3.5! h-3.5! text-xs!">pin_drop</mat-icon>
                </a>
              } @else {
                <p class="font-medium">-</p>
              }
            </div>
          </div>
          @if (
            workOrder().client.address &&
            workOrder().workAddress &&
            workOrder().client.address !== workOrder().workAddress
          ) {
            <div>
              <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ 'common.address' | translate }} {{ 'workOrders.detail.client' | translate }}
              </p>
              <div class="flex items-center gap-1.5 flex-wrap">
                <a
                  [href]="
                    'https://maps.google.com/?q=' + encodeURIComponent(workOrder().client.address!)
                  "
                  target="_blank"
                  rel="noopener"
                  class="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
                >
                  {{ workOrder().client.address }}
                </a>
                <a
                  [href]="
                    'https://maps.google.com/?q=' + encodeURIComponent(workOrder().client.address!)
                  "
                  target="_blank"
                  rel="noopener"
                  class="inline-flex items-center justify-center p-1 rounded-md bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 hover:bg-rose-100 dark:hover:bg-rose-900/60 transition-colors"
                  [title]="'common.openInMaps' | translate"
                >
                  <mat-icon class="w-3.5! h-3.5! text-xs!">pin_drop</mat-icon>
                </a>
              </div>
            </div>
          }
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.scheduledDate' | translate }}
            </p>
            <p class="font-medium">
              {{
                workOrder().scheduledDate ? (workOrder().scheduledDate | date: 'dd/MM/yyyy') : '-'
              }}
            </p>
          </div>
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.warrantyUntil' | translate }}
            </p>
            <p class="font-medium">
              {{
                workOrder().warrantyUntil ? (workOrder().warrantyUntil | date: 'dd/MM/yyyy') : '-'
              }}
            </p>
          </div>
        </div>
        @if (workOrder().diagnosis) {
          <div>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ 'workOrders.detail.diagnosis' | translate }}
            </p>
            <p class="mt-1 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              {{ workOrder().diagnosis }}
            </p>
          </div>
        }
      }
    </div>
  `,
})
export class InfoTabComponent implements OnInit {
  private readonly http = inject(HttpClient);
  private readonly clientsService = inject(ClientsService);

  workOrder = input.required<WorkOrder>();
  editable = input(false);
  saving = input(false);

  saved = output<UpdateWorkOrderDto>();

  private debounceTimer: ReturnType<typeof setTimeout> | null = null;

  readonly serviceTypes = signal<ServiceType[]>([]);

  readonly editMode = signal(false);

  readonly editClientId = signal('');
  readonly editServiceTypeId = signal('');
  readonly editDiagnosis = signal('');
  readonly editWorkAddress = signal('');
  readonly editScheduledDate = signal<Date | null>(null);
  readonly editWarrantyUntil = signal<Date | null>(null);
  readonly editLocation = signal<WorkOrderLocation>('workshop');

  readonly filteredClients = signal<Client[]>([]);
  readonly selectedClientName = signal('');
  readonly clientSearching = signal(false);

  ngOnInit(): void {
    this.http
      .get<PaginatedResponse<ServiceType>>('/api/service-types', {
        params: { limit: '100' },
        headers: new HttpHeaders({ 'X-Skip-Loading': 'true' }),
      })
      .subscribe({
        next: (response) => this.serviceTypes.set(response.data ?? []),
      });
  }

  startEdit(): void {
    const wo = this.workOrder();
    this.editClientId.set(wo.client?.id || wo.clientId || '');
    this.editServiceTypeId.set(wo.serviceType?.id || wo.serviceTypeId || '');
    this.editDiagnosis.set(wo.diagnosis || '');
    this.editWorkAddress.set(wo.workAddress || '');
    this.editScheduledDate.set(wo.scheduledDate ? new Date(wo.scheduledDate) : null);
    this.editWarrantyUntil.set(wo.warrantyUntil ? new Date(wo.warrantyUntil) : null);
    this.editLocation.set(wo.location || 'workshop');
    this.selectedClientName.set(wo.client?.name || '');
    this.editMode.set(true);
    this.searchClients(wo.client?.name || '');
  }

  onClientSearch(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.selectedClientName.set(value);
    if (this.editClientId() && value !== this.selectedClientName()) {
      this.editClientId.set('');
    }
    if (this.debounceTimer) clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.searchClients(value), 300);
  }

  onClientFocus(): void {
    if (this.filteredClients().length === 0) {
      this.searchClients('');
    }
  }

  onClientSelected(clientId: string): void {
    this.editClientId.set(clientId);
    const client = this.filteredClients().find((c) => c.id === clientId);
    if (client) {
      this.selectedClientName.set(client.name);
    }
  }

  private searchClients(query: string): void {
    this.clientSearching.set(true);
    this.clientsService.getAll({ search: query || undefined, limit: 10 }).subscribe({
      next: (data) => {
        this.filteredClients.set(data.data);
        this.clientSearching.set(false);
      },
      error: () => this.clientSearching.set(false),
    });
  }

  cancelEdit(): void {
    this.editMode.set(false);
  }

  save(): void {
    const dto: UpdateWorkOrderDto = {};
    const wo = this.workOrder();

    const clientId = this.editClientId();
    if (clientId && clientId !== (wo.client?.id || wo.clientId)) dto.clientId = clientId;

    const serviceTypeId = this.editServiceTypeId();
    if (serviceTypeId && serviceTypeId !== (wo.serviceType?.id || wo.serviceTypeId))
      dto.serviceTypeId = serviceTypeId;

    const diagnosis = this.editDiagnosis().trim();
    if (diagnosis !== (wo.diagnosis || '')) dto.diagnosis = diagnosis || undefined;

    const workAddress = this.editWorkAddress().trim();
    if (workAddress !== (wo.workAddress || '')) dto.workAddress = workAddress || undefined;

    const scheduledDate = this.editScheduledDate();
    const scheduledStr = scheduledDate ? toLocalDateString(scheduledDate) : null;
    if (scheduledStr !== (wo.scheduledDate || null)) dto.scheduledDate = scheduledStr || undefined;

    const warrantyUntil = this.editWarrantyUntil();
    const warrantyStr = warrantyUntil ? toLocalDateString(warrantyUntil) : null;
    if (warrantyStr !== (wo.warrantyUntil || null)) dto.warrantyUntil = warrantyStr || undefined;

    const location = this.editLocation();
    if (location !== wo.location) dto.location = location;

    if (Object.keys(dto).length === 0) {
      this.editMode.set(false);
      return;
    }

    this.saved.emit(dto);
    this.editMode.set(false);
  }

  getValue(event: Event): string {
    return (event.target as HTMLInputElement | HTMLTextAreaElement).value;
  }

  encodeURIComponent(value: string): string {
    return encodeURIComponent(value);
  }
}
