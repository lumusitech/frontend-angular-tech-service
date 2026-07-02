// @ts-nocheck
function stryNS_9fa48() {
  var g = typeof globalThis === 'object' && globalThis && globalThis.Math === Math && globalThis || new Function("return this")();
  var ns = g.__stryker__ || (g.__stryker__ = {});
  if (ns.activeMutant === undefined && g.process && g.process.env && g.process.env.__STRYKER_ACTIVE_MUTANT__) {
    ns.activeMutant = g.process.env.__STRYKER_ACTIVE_MUTANT__;
  }
  function retrieveNS() {
    return ns;
  }
  stryNS_9fa48 = retrieveNS;
  return retrieveNS();
}
stryNS_9fa48();
function stryCov_9fa48() {
  var ns = stryNS_9fa48();
  var cov = ns.mutantCoverage || (ns.mutantCoverage = {
    static: {},
    perTest: {}
  });
  function cover() {
    var c = cov.static;
    if (ns.currentTestId) {
      c = cov.perTest[ns.currentTestId] = cov.perTest[ns.currentTestId] || {};
    }
    var a = arguments;
    for (var i = 0; i < a.length; i++) {
      c[a[i]] = (c[a[i]] || 0) + 1;
    }
  }
  stryCov_9fa48 = cover;
  cover.apply(null, arguments);
}
function stryMutAct_9fa48(id) {
  var ns = stryNS_9fa48();
  function isActive(id) {
    if (ns.activeMutant === id) {
      if (ns.hitCount !== void 0 && ++ns.hitCount > ns.hitLimit) {
        throw new Error('Stryker: Hit count limit reached (' + ns.hitCount + ')');
      }
      return true;
    }
    return false;
  }
  stryMutAct_9fa48 = isActive;
  return isActive(id);
}
import { Component, inject, signal, OnInit } from '@angular/core';
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
import { FormsModule } from '@angular/forms';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { ClientsService } from '../../core/services/clients.service';
import { ServiceTypesService } from '../../core/services/service-types.service';
import { CreateWorkOrderDto, WorkOrderPriority, WorkOrderLocation } from '../../core/models/work-order.interfaces';
import { Client } from '../../core/models/client.interfaces';
import { ServiceType } from '../../core/models/service-type.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  mode: 'create';
}
@Component({
  selector: 'app-work-order-form',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, MatAutocompleteModule, MatDatepickerModule, MatNativeDateModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>assignment</mat-icon>
      {{ 'workOrders.newOrder' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.client' | translate }}</mat-label>
          <mat-select [(ngModel)]="clientId" [ngModelOptions]="{standalone: true}">
            @for (client of clients(); track client.id) {
              <mat-option [value]="client.id">
                {{ client.name }}
              </mat-option>
            }
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.serviceType' | translate }}</mat-label>
          <mat-select [(ngModel)]="serviceTypeId" [ngModelOptions]="{standalone: true}">
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
            <mat-select [(ngModel)]="priority" [ngModelOptions]="{standalone: true}">
              <mat-option value="low">{{ 'workOrders.priorities.low' | translate }}</mat-option>
              <mat-option value="medium">{{ 'workOrders.priorities.medium' | translate }}</mat-option>
              <mat-option value="high">{{ 'workOrders.priorities.high' | translate }}</mat-option>
              <mat-option value="urgent">{{ 'workOrders.priorities.urgent' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>

          <mat-form-field appearance="outline" class="w-full">
            <mat-label>{{ 'workOrders.location' | translate }}</mat-label>
            <mat-select [(ngModel)]="location" [ngModelOptions]="{standalone: true}">
              <mat-option value="workshop">{{ 'workOrders.locations.workshop' | translate }}</mat-option>
              <mat-option value="on_site">{{ 'workOrders.locations.onSite' | translate }}</mat-option>
            </mat-select>
          </mat-form-field>
        </div>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.scheduledDate' | translate }}</mat-label>
          <input matInput [matDatepicker]="scheduledPicker" [value]="scheduledDateValue()" (dateChange)="onScheduledDateChange($event)" (click)="scheduledPicker.open()" />
          <mat-datepicker-toggle matIconSuffix [for]="scheduledPicker"></mat-datepicker-toggle>
          <mat-datepicker #scheduledPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.warrantyUntil' | translate }}</mat-label>
          <input matInput [matDatepicker]="warrantyPicker" [value]="warrantyUntilValue()" (dateChange)="onWarrantyUntilChange($event)" (click)="warrantyPicker.open()" />
          <mat-datepicker-toggle matIconSuffix [for]="warrantyPicker"></mat-datepicker-toggle>
          <mat-datepicker #warrantyPicker></mat-datepicker>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.initialDiagnosis' | translate }}</mat-label>
          <textarea matInput [(ngModel)]="diagnosis" [ngModelOptions]="{standalone: true}" rows="3"></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.workAddress' | translate }}</mat-label>
          <input matInput [(ngModel)]="workAddress" [ngModelOptions]="{standalone: true}" [placeholder]="'workOrders.workAddressPlaceholder' | translate" />
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSubmit($event)" [disabled]="saving()">
        {{ saving() ? ('workOrders.creating' | translate) : ('workOrders.createOrder' | translate) }}
      </button>
    </mat-dialog-actions>
  `
})
export class WorkOrderFormComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<WorkOrderFormComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly clientsService = inject(ClientsService);
  private readonly serviceTypesService = inject(ServiceTypesService);
  readonly clients = signal<Client[]>(stryMutAct_9fa48("5579") ? ["Stryker was here"] : (stryCov_9fa48("5579"), []));
  readonly serviceTypes = signal<ServiceType[]>(stryMutAct_9fa48("5580") ? ["Stryker was here"] : (stryCov_9fa48("5580"), []));
  readonly clientId = signal(stryMutAct_9fa48("5581") ? "Stryker was here!" : (stryCov_9fa48("5581"), ''));
  readonly serviceTypeId = signal(stryMutAct_9fa48("5582") ? "Stryker was here!" : (stryCov_9fa48("5582"), ''));
  readonly priority = signal<WorkOrderPriority>(stryMutAct_9fa48("5583") ? "" : (stryCov_9fa48("5583"), 'medium'));
  readonly location = signal<WorkOrderLocation>(stryMutAct_9fa48("5584") ? "" : (stryCov_9fa48("5584"), 'workshop'));
  readonly scheduledDate = signal(stryMutAct_9fa48("5585") ? "Stryker was here!" : (stryCov_9fa48("5585"), ''));
  readonly warrantyUntil = signal(stryMutAct_9fa48("5586") ? "Stryker was here!" : (stryCov_9fa48("5586"), ''));
  readonly diagnosis = signal(stryMutAct_9fa48("5587") ? "Stryker was here!" : (stryCov_9fa48("5587"), ''));
  readonly workAddress = signal(stryMutAct_9fa48("5588") ? "Stryker was here!" : (stryCov_9fa48("5588"), ''));
  readonly saving = signal(stryMutAct_9fa48("5589") ? true : (stryCov_9fa48("5589"), false));
  ngOnInit(): void {
    if (stryMutAct_9fa48("5590")) {
      {}
    } else {
      stryCov_9fa48("5590");
      this.clientsService.getAll(stryMutAct_9fa48("5591") ? {} : (stryCov_9fa48("5591"), {
        limit: 100
      })).subscribe(stryMutAct_9fa48("5592") ? {} : (stryCov_9fa48("5592"), {
        next: stryMutAct_9fa48("5593") ? () => undefined : (stryCov_9fa48("5593"), data => this.clients.set(data.data))
      }));
      this.serviceTypesService.getAll(stryMutAct_9fa48("5594") ? {} : (stryCov_9fa48("5594"), {
        limit: 100
      })).subscribe(stryMutAct_9fa48("5595") ? {} : (stryCov_9fa48("5595"), {
        next: stryMutAct_9fa48("5596") ? () => undefined : (stryCov_9fa48("5596"), data => this.serviceTypes.set(data.data))
      }));
    }
  }
  scheduledDateValue(): Date | null {
    if (stryMutAct_9fa48("5597")) {
      {}
    } else {
      stryCov_9fa48("5597");
      const v = this.scheduledDate();
      return v ? new Date(v) : null;
    }
  }
  warrantyUntilValue(): Date | null {
    if (stryMutAct_9fa48("5598")) {
      {}
    } else {
      stryCov_9fa48("5598");
      const v = this.warrantyUntil();
      return v ? new Date(v) : null;
    }
  }
  onScheduledDateChange(event: {
    value: Date | null;
  }): void {
    if (stryMutAct_9fa48("5599")) {
      {}
    } else {
      stryCov_9fa48("5599");
      this.scheduledDate.set(event.value ? toLocalDateString(event.value) : stryMutAct_9fa48("5600") ? "Stryker was here!" : (stryCov_9fa48("5600"), ''));
    }
  }
  onWarrantyUntilChange(event: {
    value: Date | null;
  }): void {
    if (stryMutAct_9fa48("5601")) {
      {}
    } else {
      stryCov_9fa48("5601");
      this.warrantyUntil.set(event.value ? toLocalDateString(event.value) : stryMutAct_9fa48("5602") ? "Stryker was here!" : (stryCov_9fa48("5602"), ''));
    }
  }
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("5603")) {
      {}
    } else {
      stryCov_9fa48("5603");
      return (event.target as HTMLInputElement).value;
    }
  }
  onSubmit(event: Event): void {
    if (stryMutAct_9fa48("5604")) {
      {}
    } else {
      stryCov_9fa48("5604");
      event.preventDefault();
      this.saving.set(stryMutAct_9fa48("5605") ? false : (stryCov_9fa48("5605"), true));
      const dto: CreateWorkOrderDto = stryMutAct_9fa48("5606") ? {} : (stryCov_9fa48("5606"), {
        clientId: this.clientId(),
        serviceTypeId: this.serviceTypeId(),
        priority: this.priority(),
        location: this.location(),
        scheduledDate: stryMutAct_9fa48("5609") ? this.scheduledDate() && undefined : stryMutAct_9fa48("5608") ? false : stryMutAct_9fa48("5607") ? true : (stryCov_9fa48("5607", "5608", "5609"), this.scheduledDate() || undefined),
        warrantyUntil: stryMutAct_9fa48("5612") ? this.warrantyUntil() && undefined : stryMutAct_9fa48("5611") ? false : stryMutAct_9fa48("5610") ? true : (stryCov_9fa48("5610", "5611", "5612"), this.warrantyUntil() || undefined),
        diagnosis: stryMutAct_9fa48("5615") ? this.diagnosis() && undefined : stryMutAct_9fa48("5614") ? false : stryMutAct_9fa48("5613") ? true : (stryCov_9fa48("5613", "5614", "5615"), this.diagnosis() || undefined),
        workAddress: stryMutAct_9fa48("5618") ? this.workAddress() && undefined : stryMutAct_9fa48("5617") ? false : stryMutAct_9fa48("5616") ? true : (stryCov_9fa48("5616", "5617", "5618"), this.workAddress() || undefined)
      });
      this.workOrdersService.create(dto).subscribe(stryMutAct_9fa48("5619") ? {} : (stryCov_9fa48("5619"), {
        next: () => {
          if (stryMutAct_9fa48("5620")) {
            {}
          } else {
            stryCov_9fa48("5620");
            this.saving.set(stryMutAct_9fa48("5621") ? true : (stryCov_9fa48("5621"), false));
            this.dialogRef.close(stryMutAct_9fa48("5622") ? false : (stryCov_9fa48("5622"), true));
          }
        },
        error: () => {
          if (stryMutAct_9fa48("5623")) {
            {}
          } else {
            stryCov_9fa48("5623");
            this.saving.set(stryMutAct_9fa48("5624") ? true : (stryCov_9fa48("5624"), false));
          }
        }
      }));
    }
  }
}