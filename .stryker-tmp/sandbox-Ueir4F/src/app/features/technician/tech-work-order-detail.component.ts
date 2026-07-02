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
import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { httpResource } from '@angular/common/http';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WorkOrder, WorkOrderStatus } from '../../core/models/work-order.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { PageHeaderComponent } from '../../shared/components/page-header/page-header.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { UrgencyIndicatorComponent } from '../../shared/components/urgency-indicator/urgency-indicator.component';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { AddNoteDialogComponent } from '../work-orders/add-note-dialog.component';
import { DatePipe, DecimalPipe } from '@angular/common';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { RelativeDatePipe } from '../../shared/pipes/relative-date.pipe';
import { StatusLabelPipe } from '../../shared/pipes/status-label.pipe';
const VALID_TRANSITIONS: Record<string, string[]> = stryMutAct_9fa48("4875") ? {} : (stryCov_9fa48("4875"), {
  assigned: stryMutAct_9fa48("4876") ? [] : (stryCov_9fa48("4876"), [stryMutAct_9fa48("4877") ? "" : (stryCov_9fa48("4877"), 'in_progress'), stryMutAct_9fa48("4878") ? "" : (stryCov_9fa48("4878"), 'cancelled')]),
  in_progress: stryMutAct_9fa48("4879") ? [] : (stryCov_9fa48("4879"), [stryMutAct_9fa48("4880") ? "" : (stryCov_9fa48("4880"), 'completed'), stryMutAct_9fa48("4881") ? "" : (stryCov_9fa48("4881"), 'cancelled')])
});
@Component({
  selector: 'app-tech-work-order-detail',
  imports: [MatIconModule, MatButtonModule, MatCardModule, MatProgressSpinnerModule, MatDialogModule, PageHeaderComponent, ErrorStateComponent, UrgencyIndicatorComponent, DatePipe, DecimalPipe, TranslatePipe, StatusLabelPipe, RelativeDatePipe],
  template: `
    @if (resource.status() === 'loading' && !resource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="40" />
      </div>
    } @else if (resource.error()) {
      <app-error-state (retry)="resource.reload()" />
    } @else if (resource.hasValue()) {
      @let order = resource.value();

      <div class="space-y-4">
        <app-page-header
          [title]="order.trackingCode"
          [subtitle]="order.client?.name || ''"
        >
          <button mat-button (click)="goBack()">
            <mat-icon>arrow_back</mat-icon>
            {{ 'common.back' | translate }}
          </button>
        </app-page-header>

        <!-- Status + urgency + priority -->
        <div class="flex items-center gap-3 flex-wrap">
          <span
            class="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium"
            [class]="getStatusColor(order.status)"
          >
            {{ order.status | statusLabel: 'workOrderStatus' }}
          </span>
          <app-urgency-indicator [scheduledDate]="order.scheduledDate || null" />
          <span class="text-xs text-gray-500 dark:text-gray-400">
            {{ order.serviceType?.name || '-' }}
          </span>
          @if (order.location) {
            <span class="text-xs text-gray-500 dark:text-gray-400">
              {{ order.location === 'workshop' ? 'Taller' : 'Domicilio' }}
            </span>
          }
        </div>

        <!-- Action buttons -->
        @if (getValidTransitions(order.status).length > 0) {
          <div class="flex gap-2 flex-wrap">
            @for (transition of getValidTransitions(order.status); track transition) {
              <button
                mat-flat-button
                [color]="transition === 'cancelled' ? 'warn' : 'primary'"
                (click)="changeStatus(order, transition)"
              >
                {{ 'workOrders.changeStatus' | translate }} → {{ transition | statusLabel: 'workOrderStatus' }}
              </button>
            }
          </div>
        }

        <!-- Tasks checklist -->
        @if (order.tasks && order.tasks.length > 0) {
          <mat-card class="p-4">
            <div class="flex items-center justify-between mb-3">
              <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                {{ 'technician.tasks' | translate }}
              </h3>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ getCompletedTasks(order) }}/{{ order.tasks.length }}
              </span>
            </div>
            <!-- Progress bar -->
            <div class="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-full mb-3 overflow-hidden">
              <div
                class="h-full bg-green-500 rounded-full transition-all"
                [style.width.%]="getTaskProgress(order)"
              ></div>
            </div>
            <div class="space-y-2">
              @for (task of order.tasks; track task.id) {
                <div
                  class="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                  (click)="toggleTask(order.id, task)"
                >
                  <div
                    class="w-5 h-5 rounded border-2 flex items-center justify-center shrink-0"
                    [class]="
                      task.isCompleted
                        ? 'bg-green-500 border-green-500'
                        : 'border-gray-300 dark:border-gray-600'
                    "
                  >
                    @if (task.isCompleted) {
                      <mat-icon class="text-white !w-3.5 !h-3.5">check</mat-icon>
                    }
                  </div>
                  <div class="flex-1 min-w-0">
                    <p
                      class="text-sm"
                      [class]="task.isCompleted ? 'text-gray-400 dark:text-gray-500 line-through' : 'text-gray-900 dark:text-gray-100'"
                    >
                      {{ task.title }}
                    </p>
                    @if (task.description) {
                      <p class="text-xs text-gray-400 dark:text-gray-500 truncate">
                        {{ task.description }}
                      </p>
                    }
                  </div>
                </div>
              }
            </div>
          </mat-card>
        }

        <!-- Materials -->
        @if (order.materials && order.materials.length > 0) {
          <mat-card class="p-4">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
              {{ 'technician.materials' | translate }}
            </h3>
            <div class="space-y-2">
              @for (material of order.materials; track material.id) {
                <div class="flex items-center justify-between p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div>
                    <p class="text-sm text-gray-900 dark:text-gray-100">{{ material.description }}</p>
                    <p class="text-xs text-gray-400 dark:text-gray-500">
                      {{ material.quantity }} x {{ material.unitCost | number: '1.2-2' }}
                    </p>
                  </div>
                  <p class="text-sm font-semibold text-gray-900 dark:text-gray-100">
                    {{ material.quantity * material.unitCost | number: '1.2-2' }}
                  </p>
                </div>
              }
            </div>
          </mat-card>
        }

        <!-- Notes -->
        <mat-card class="p-4">
          <div class="flex items-center justify-between mb-3">
            <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100">
              {{ 'technician.notes' | translate }}
            </h3>
            <button mat-button color="primary" (click)="addNote(order.id)">
              <mat-icon>add</mat-icon>
              {{ 'technician.addNote' | translate }}
            </button>
          </div>
          @if (order.notes && order.notes.length > 0) {
            <div class="space-y-2">
              @for (note of order.notes; track note.id) {
                <div class="p-2 rounded-lg bg-gray-50 dark:bg-gray-700/50">
                  <div class="flex items-center gap-2 mb-1">
                    <span
                      class="inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium"
                      [class]="getNoteTypeClass(note.type)"
                    >
                      {{ note.type | statusLabel: 'noteType' }}
                    </span>
                    <span class="text-xs text-gray-400 dark:text-gray-500">
                      {{ note.createdAt | relativeDate }}
                    </span>
                  </div>
                  <p class="text-sm text-gray-700 dark:text-gray-300">{{ note.content }}</p>
                </div>
              }
            </div>
          } @else {
            <p class="text-sm text-gray-400 dark:text-gray-500">{{ 'common.noResults' | translate }}</p>
          }
        </mat-card>

        <!-- Info -->
        <mat-card class="p-4">
          <h3 class="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-3">
            {{ 'common.details' | translate }}
          </h3>
          <div class="grid grid-cols-2 gap-3 text-sm">
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{ 'workOrders.scheduledDate' | translate }}</span>
              <p class="text-gray-900 dark:text-gray-100">{{ order.scheduledDate ? (order.scheduledDate | date: 'dd/MM/yyyy') : '-' }}</p>
            </div>
            <div>
              <span class="text-gray-500 dark:text-gray-400 text-xs">{{ 'workOrders.diagnosis' | translate }}</span>
              <p class="text-gray-900 dark:text-gray-100">{{ order.diagnosis || '-' }}</p>
            </div>
          </div>
        </mat-card>
      </div>
    }
  `
})
export class TechWorkOrderDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly dialog = inject(MatDialog);
  readonly resource = httpResource<WorkOrder>(() => {
    if (stryMutAct_9fa48("4882")) {
      {}
    } else {
      stryCov_9fa48("4882");
      const id = this.route.snapshot.paramMap.get(stryMutAct_9fa48("4883") ? "" : (stryCov_9fa48("4883"), 'id'));
      return id ? stryMutAct_9fa48("4884") ? `` : (stryCov_9fa48("4884"), `/api/work-orders/${id}`) : stryMutAct_9fa48("4885") ? "Stryker was here!" : (stryCov_9fa48("4885"), '');
    }
  });
  getStatusColor(status: string): string {
    if (stryMutAct_9fa48("4886")) {
      {}
    } else {
      stryCov_9fa48("4886");
      const colors: Record<string, string> = stryMutAct_9fa48("4887") ? {} : (stryCov_9fa48("4887"), {
        pending: stryMutAct_9fa48("4888") ? "" : (stryCov_9fa48("4888"), 'bg-yellow-500/15 text-yellow-400'),
        assigned: stryMutAct_9fa48("4889") ? "" : (stryCov_9fa48("4889"), 'bg-blue-500/15 text-blue-400'),
        in_progress: stryMutAct_9fa48("4890") ? "" : (stryCov_9fa48("4890"), 'bg-purple-500/15 text-purple-400'),
        completed: stryMutAct_9fa48("4891") ? "" : (stryCov_9fa48("4891"), 'bg-green-500/15 text-green-400'),
        delivered: stryMutAct_9fa48("4892") ? "" : (stryCov_9fa48("4892"), 'bg-gray-500/15 text-gray-400'),
        cancelled: stryMutAct_9fa48("4893") ? "" : (stryCov_9fa48("4893"), 'bg-red-500/15 text-red-400')
      });
      return stryMutAct_9fa48("4896") ? colors[status] && 'bg-gray-500/15 text-gray-400' : stryMutAct_9fa48("4895") ? false : stryMutAct_9fa48("4894") ? true : (stryCov_9fa48("4894", "4895", "4896"), colors[status] || (stryMutAct_9fa48("4897") ? "" : (stryCov_9fa48("4897"), 'bg-gray-500/15 text-gray-400')));
    }
  }
  getValidTransitions(status: string): string[] {
    if (stryMutAct_9fa48("4898")) {
      {}
    } else {
      stryCov_9fa48("4898");
      return stryMutAct_9fa48("4901") ? VALID_TRANSITIONS[status] && [] : stryMutAct_9fa48("4900") ? false : stryMutAct_9fa48("4899") ? true : (stryCov_9fa48("4899", "4900", "4901"), VALID_TRANSITIONS[status] || (stryMutAct_9fa48("4902") ? ["Stryker was here"] : (stryCov_9fa48("4902"), [])));
    }
  }
  getCompletedTasks(order: WorkOrder): number {
    if (stryMutAct_9fa48("4903")) {
      {}
    } else {
      stryCov_9fa48("4903");
      return stryMutAct_9fa48("4906") ? order.tasks?.filter(t => t.isCompleted).length && 0 : stryMutAct_9fa48("4905") ? false : stryMutAct_9fa48("4904") ? true : (stryCov_9fa48("4904", "4905", "4906"), (stryMutAct_9fa48("4908") ? order.tasks.filter(t => t.isCompleted).length : stryMutAct_9fa48("4907") ? order.tasks.length : (stryCov_9fa48("4907", "4908"), order.tasks?.filter(stryMutAct_9fa48("4909") ? () => undefined : (stryCov_9fa48("4909"), t => t.isCompleted)).length)) || 0);
    }
  }
  getTaskProgress(order: WorkOrder): number {
    if (stryMutAct_9fa48("4910")) {
      {}
    } else {
      stryCov_9fa48("4910");
      if (stryMutAct_9fa48("4913") ? !order.tasks && order.tasks.length === 0 : stryMutAct_9fa48("4912") ? false : stryMutAct_9fa48("4911") ? true : (stryCov_9fa48("4911", "4912", "4913"), (stryMutAct_9fa48("4914") ? order.tasks : (stryCov_9fa48("4914"), !order.tasks)) || (stryMutAct_9fa48("4916") ? order.tasks.length !== 0 : stryMutAct_9fa48("4915") ? false : (stryCov_9fa48("4915", "4916"), order.tasks.length === 0)))) return 0;
      return stryMutAct_9fa48("4917") ? this.getCompletedTasks(order) / order.tasks.length / 100 : (stryCov_9fa48("4917"), (stryMutAct_9fa48("4918") ? this.getCompletedTasks(order) * order.tasks.length : (stryCov_9fa48("4918"), this.getCompletedTasks(order) / order.tasks.length)) * 100);
    }
  }
  getNoteTypeClass(type: string): string {
    if (stryMutAct_9fa48("4919")) {
      {}
    } else {
      stryCov_9fa48("4919");
      const classes: Record<string, string> = stryMutAct_9fa48("4920") ? {} : (stryCov_9fa48("4920"), {
        diagnosis: stryMutAct_9fa48("4921") ? "" : (stryCov_9fa48("4921"), 'bg-blue-500/15 text-blue-400'),
        issue: stryMutAct_9fa48("4922") ? "" : (stryCov_9fa48("4922"), 'bg-red-500/15 text-red-400'),
        observation: stryMutAct_9fa48("4923") ? "" : (stryCov_9fa48("4923"), 'bg-gray-500/15 text-gray-400'),
        internal: stryMutAct_9fa48("4924") ? "" : (stryCov_9fa48("4924"), 'bg-yellow-500/15 text-yellow-400')
      });
      return stryMutAct_9fa48("4927") ? classes[type] && 'bg-gray-500/15 text-gray-400' : stryMutAct_9fa48("4926") ? false : stryMutAct_9fa48("4925") ? true : (stryCov_9fa48("4925", "4926", "4927"), classes[type] || (stryMutAct_9fa48("4928") ? "" : (stryCov_9fa48("4928"), 'bg-gray-500/15 text-gray-400')));
    }
  }
  goBack(): void {
    if (stryMutAct_9fa48("4929")) {
      {}
    } else {
      stryCov_9fa48("4929");
      this.router.navigate(stryMutAct_9fa48("4930") ? [] : (stryCov_9fa48("4930"), [stryMutAct_9fa48("4931") ? "" : (stryCov_9fa48("4931"), '/tech')]));
    }
  }
  toggleTask(workOrderId: string, task: {
    id: string;
    isCompleted: boolean;
  }): void {
    if (stryMutAct_9fa48("4932")) {
      {}
    } else {
      stryCov_9fa48("4932");
      this.workOrdersService.updateTask(workOrderId, task.id, stryMutAct_9fa48("4933") ? {} : (stryCov_9fa48("4933"), {
        isCompleted: stryMutAct_9fa48("4934") ? task.isCompleted : (stryCov_9fa48("4934"), !task.isCompleted)
      })).subscribe(stryMutAct_9fa48("4935") ? {} : (stryCov_9fa48("4935"), {
        next: stryMutAct_9fa48("4936") ? () => undefined : (stryCov_9fa48("4936"), () => this.resource.reload())
      }));
    }
  }
  changeStatus(order: WorkOrder, newStatus: string): void {
    if (stryMutAct_9fa48("4937")) {
      {}
    } else {
      stryCov_9fa48("4937");
      const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("4938") ? {} : (stryCov_9fa48("4938"), {
        width: stryMutAct_9fa48("4939") ? "" : (stryCov_9fa48("4939"), '400px'),
        data: stryMutAct_9fa48("4940") ? {} : (stryCov_9fa48("4940"), {
          title: stryMutAct_9fa48("4941") ? "" : (stryCov_9fa48("4941"), 'workOrders.changeStatus'),
          message: stryMutAct_9fa48("4942") ? `` : (stryCov_9fa48("4942"), `¿Cambiar estado a "${newStatus}"?`),
          confirmLabel: stryMutAct_9fa48("4943") ? "" : (stryCov_9fa48("4943"), 'Confirmar'),
          color: (stryMutAct_9fa48("4946") ? newStatus !== 'cancelled' : stryMutAct_9fa48("4945") ? false : stryMutAct_9fa48("4944") ? true : (stryCov_9fa48("4944", "4945", "4946"), newStatus === (stryMutAct_9fa48("4947") ? "" : (stryCov_9fa48("4947"), 'cancelled')))) ? stryMutAct_9fa48("4948") ? "" : (stryCov_9fa48("4948"), 'warn') : stryMutAct_9fa48("4949") ? "" : (stryCov_9fa48("4949"), 'primary')
        })
      }));
      dialogRef.afterClosed().subscribe(confirmed => {
        if (stryMutAct_9fa48("4950")) {
          {}
        } else {
          stryCov_9fa48("4950");
          if (stryMutAct_9fa48("4952") ? false : stryMutAct_9fa48("4951") ? true : (stryCov_9fa48("4951", "4952"), confirmed)) {
            if (stryMutAct_9fa48("4953")) {
              {}
            } else {
              stryCov_9fa48("4953");
              this.workOrdersService.update(order.id, stryMutAct_9fa48("4954") ? {} : (stryCov_9fa48("4954"), {
                status: newStatus as WorkOrderStatus
              })).subscribe(stryMutAct_9fa48("4955") ? {} : (stryCov_9fa48("4955"), {
                next: stryMutAct_9fa48("4956") ? () => undefined : (stryCov_9fa48("4956"), () => this.resource.reload())
              }));
            }
          }
        }
      });
    }
  }
  addNote(workOrderId: string): void {
    if (stryMutAct_9fa48("4957")) {
      {}
    } else {
      stryCov_9fa48("4957");
      const dialogRef = this.dialog.open(AddNoteDialogComponent, stryMutAct_9fa48("4958") ? {} : (stryCov_9fa48("4958"), {
        width: stryMutAct_9fa48("4959") ? "" : (stryCov_9fa48("4959"), '500px'),
        data: stryMutAct_9fa48("4960") ? {} : (stryCov_9fa48("4960"), {
          workOrderId
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("4961")) {
          {}
        } else {
          stryCov_9fa48("4961");
          if (stryMutAct_9fa48("4963") ? false : stryMutAct_9fa48("4962") ? true : (stryCov_9fa48("4962", "4963"), result)) this.resource.reload();
        }
      });
    }
  }
}