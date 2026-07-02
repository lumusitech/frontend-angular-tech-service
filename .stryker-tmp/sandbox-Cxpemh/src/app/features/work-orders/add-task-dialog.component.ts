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
import { httpResource } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { User } from '../../core/models/user.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  workOrderId: string;
}
@Component({
  selector: 'app-add-task-dialog',
  imports: [MatDialogModule, MatButtonModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatIconModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>add_task</mat-icon>
      {{ 'workOrders.tasks.addTask' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      <form (submit)="onSubmit($event)" class="space-y-4">
        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.tasks.title' | translate }}</mat-label>
          <input
            matInput
            [value]="title()"
            (input)="title.set(getInputValue($event))"
            [placeholder]="'workOrders.tasks.titlePlaceholder' | translate"
          />
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.tasks.descriptionOptional' | translate }}</mat-label>
          <textarea
            matInput
            [value]="taskDescription()"
            (input)="taskDescription.set(getInputValue($event))"
            rows="3"
            [placeholder]="'workOrders.tasks.descriptionPlaceholder' | translate"
          ></textarea>
        </mat-form-field>

        <mat-form-field appearance="outline" class="w-full">
          <mat-label>{{ 'workOrders.tasks.assignTechnician' | translate }}</mat-label>
          <mat-select [value]="assignedToId()" (selectionChange)="assignedToId.set($event.value)">
            <mat-option>{{ 'workOrders.tasks.unassigned' | translate }}</mat-option>
            @if (techniciansResource.hasValue()) {
              @for (tech of techniciansResource.value().data; track tech.id) {
                <mat-option [value]="tech.id">{{ tech.name }}</mat-option>
              }
            }
          </mat-select>
        </mat-form-field>
      </form>
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button
        mat-flat-button
        color="primary"
        (click)="onSubmit($event)"
        [disabled]="saving() || !title()"
      >
        {{
          saving()
            ? ('workOrders.tasks.creating' | translate)
            : ('workOrders.tasks.createTask' | translate)
        }}
      </button>
    </mat-dialog-actions>
  `
})
export class AddTaskDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<AddTaskDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly title = signal(stryMutAct_9fa48("5349") ? "Stryker was here!" : (stryCov_9fa48("5349"), ''));
  readonly taskDescription = signal(stryMutAct_9fa48("5350") ? "Stryker was here!" : (stryCov_9fa48("5350"), ''));
  readonly assignedToId = signal(stryMutAct_9fa48("5351") ? "Stryker was here!" : (stryCov_9fa48("5351"), ''));
  readonly saving = signal(stryMutAct_9fa48("5352") ? true : (stryCov_9fa48("5352"), false));
  readonly techniciansResource = httpResource<PaginatedResponse<User>>(stryMutAct_9fa48("5353") ? () => undefined : (stryCov_9fa48("5353"), () => stryMutAct_9fa48("5354") ? {} : (stryCov_9fa48("5354"), {
    url: stryMutAct_9fa48("5355") ? "" : (stryCov_9fa48("5355"), '/api/users?role=technician&limit=100')
  })));
  getInputValue(event: Event): string {
    if (stryMutAct_9fa48("5356")) {
      {}
    } else {
      stryCov_9fa48("5356");
      return (event.target as HTMLInputElement).value;
    }
  }
  onSubmit(event: Event): void {
    if (stryMutAct_9fa48("5357")) {
      {}
    } else {
      stryCov_9fa48("5357");
      event.preventDefault();
      if (stryMutAct_9fa48("5360") ? false : stryMutAct_9fa48("5359") ? true : stryMutAct_9fa48("5358") ? this.title() : (stryCov_9fa48("5358", "5359", "5360"), !this.title())) return;
      this.saving.set(stryMutAct_9fa48("5361") ? false : (stryCov_9fa48("5361"), true));
      this.workOrdersService.addTask(this.data.workOrderId, stryMutAct_9fa48("5362") ? {} : (stryCov_9fa48("5362"), {
        title: this.title(),
        description: stryMutAct_9fa48("5365") ? this.taskDescription() && undefined : stryMutAct_9fa48("5364") ? false : stryMutAct_9fa48("5363") ? true : (stryCov_9fa48("5363", "5364", "5365"), this.taskDescription() || undefined),
        assignedToId: stryMutAct_9fa48("5368") ? this.assignedToId() && undefined : stryMutAct_9fa48("5367") ? false : stryMutAct_9fa48("5366") ? true : (stryCov_9fa48("5366", "5367", "5368"), this.assignedToId() || undefined)
      })).subscribe(stryMutAct_9fa48("5369") ? {} : (stryCov_9fa48("5369"), {
        next: () => {
          if (stryMutAct_9fa48("5370")) {
            {}
          } else {
            stryCov_9fa48("5370");
            this.saving.set(stryMutAct_9fa48("5371") ? true : (stryCov_9fa48("5371"), false));
            this.dialogRef.close(stryMutAct_9fa48("5372") ? false : (stryCov_9fa48("5372"), true));
          }
        },
        error: () => {
          if (stryMutAct_9fa48("5373")) {
            {}
          } else {
            stryCov_9fa48("5373");
            this.saving.set(stryMutAct_9fa48("5374") ? true : (stryCov_9fa48("5374"), false));
          }
        }
      }));
    }
  }
}