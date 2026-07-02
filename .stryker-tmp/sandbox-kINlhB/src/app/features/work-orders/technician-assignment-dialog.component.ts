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
import { MatIconModule } from '@angular/material/icon';
import { MatListModule, MatSelectionListChange } from '@angular/material/list';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule } from '@angular/forms';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { PaginatedResponse } from '../../core/models/client.interfaces';
import { User } from '../../core/models/user.interfaces';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
interface DialogData {
  workOrderId: string;
  currentTechnicianIds: string[];
}
@Component({
  selector: 'app-technician-assignment-dialog',
  imports: [MatDialogModule, MatButtonModule, MatIconModule, MatListModule, MatProgressSpinnerModule, FormsModule, TranslatePipe],
  template: `
    <h2 mat-dialog-title class="flex items-center gap-2">
      <mat-icon>engineering</mat-icon>
      {{ 'workOrders.technicians.assign' | translate }}
    </h2>

    <mat-dialog-content class="!p-6">
      @if (techniciansResource.isLoading()) {
        <div class="flex justify-center py-8">
          <mat-spinner diameter="36" />
        </div>
      } @else if (techniciansResource.hasValue()) {
        <mat-selection-list [(ngModel)]="selectedIds" [ngModelOptions]="{standalone: true}" (selectionChange)="onSelectionChange($event)">
          @for (tech of techniciansResource.value().data; track tech.id) {
            <mat-list-option [value]="tech.id">
              <div class="flex items-center gap-3">
                <div
                  class="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center"
                >
                  <span class="text-blue-600 dark:text-blue-400 text-sm font-medium">{{
                    tech.name.charAt(0)
                  }}</span>
                </div>
                <div>
                  <p class="font-medium">{{ tech.name }}</p>
                  <p class="text-xs text-gray-500 dark:text-gray-400">{{ tech.email }}</p>
                </div>
              </div>
            </mat-list-option>
          }
        </mat-selection-list>
      }
    </mat-dialog-content>

    <mat-dialog-actions align="end">
      <button mat-button mat-dialog-close>{{ 'common.cancel' | translate }}</button>
      <button mat-flat-button color="primary" (click)="onSave()" [disabled]="saving()">
        {{
          saving()
            ? ('common.saving' | translate)
            : ('workOrders.technicians.saveTechnicians' | translate)
        }}
      </button>
    </mat-dialog-actions>
  `
})
export class TechnicianAssignmentDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<TechnicianAssignmentDialogComponent>);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly data = inject<DialogData>(MAT_DIALOG_DATA);
  readonly selectedIds: string[] = stryMutAct_9fa48("5473") ? [] : (stryCov_9fa48("5473"), [...this.data.currentTechnicianIds]);
  readonly saving = signal(stryMutAct_9fa48("5474") ? true : (stryCov_9fa48("5474"), false));
  readonly techniciansResource = httpResource<PaginatedResponse<User>>(stryMutAct_9fa48("5475") ? () => undefined : (stryCov_9fa48("5475"), () => stryMutAct_9fa48("5476") ? {} : (stryCov_9fa48("5476"), {
    url: stryMutAct_9fa48("5477") ? "" : (stryCov_9fa48("5477"), '/api/users?role=technician&limit=100')
  })));
  onSelectionChange(event: MatSelectionListChange): void {
    if (stryMutAct_9fa48("5478")) {
      {}
    } else {
      stryCov_9fa48("5478");
      this.selectedIds.length = 0;
      for (const option of event.options) {
        if (stryMutAct_9fa48("5479")) {
          {}
        } else {
          stryCov_9fa48("5479");
          if (stryMutAct_9fa48("5481") ? false : stryMutAct_9fa48("5480") ? true : (stryCov_9fa48("5480", "5481"), option.selected)) {
            if (stryMutAct_9fa48("5482")) {
              {}
            } else {
              stryCov_9fa48("5482");
              this.selectedIds.push(option.value);
            }
          }
        }
      }
    }
  }
  onSave(): void {
    if (stryMutAct_9fa48("5483")) {
      {}
    } else {
      stryCov_9fa48("5483");
      this.saving.set(stryMutAct_9fa48("5484") ? false : (stryCov_9fa48("5484"), true));
      this.workOrdersService.replaceTechnicians(this.data.workOrderId, this.selectedIds).subscribe(stryMutAct_9fa48("5485") ? {} : (stryCov_9fa48("5485"), {
        next: () => {
          if (stryMutAct_9fa48("5486")) {
            {}
          } else {
            stryCov_9fa48("5486");
            this.saving.set(stryMutAct_9fa48("5487") ? true : (stryCov_9fa48("5487"), false));
            this.dialogRef.close(stryMutAct_9fa48("5488") ? false : (stryCov_9fa48("5488"), true));
          }
        },
        error: () => {
          if (stryMutAct_9fa48("5489")) {
            {}
          } else {
            stryCov_9fa48("5489");
            this.saving.set(stryMutAct_9fa48("5490") ? true : (stryCov_9fa48("5490"), false));
          }
        }
      }));
    }
  }
}