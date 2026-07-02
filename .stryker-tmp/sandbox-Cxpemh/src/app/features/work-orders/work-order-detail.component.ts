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
import { httpResource } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { WorkOrdersService } from '../../core/services/work-orders.service';
import { WorkOrder, WorkOrderStatus, UpdateWorkOrderDto } from '../../core/models/work-order.interfaces';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { StatusBadgeComponent } from '../../shared/components/status-badge/status-badge.component';
import { TrackingCodeComponent } from '../../shared/components/tracking-code/tracking-code.component';
import { ErrorStateComponent } from '../../shared/components/error-state/error-state.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';
import { StatusTransitionComponent } from './status-transition.component';
import { AddNoteDialogComponent } from './add-note-dialog.component';
import { AddMaterialDialogComponent } from './add-material-dialog.component';
import { AddTaskDialogComponent } from './add-task-dialog.component';
import { TechnicianAssignmentDialogComponent } from './technician-assignment-dialog.component';
import { InfoTabComponent } from './tabs/info-tab.component';
import { TasksTabComponent } from './tabs/tasks-tab.component';
import { MaterialsTabComponent } from './tabs/materials-tab.component';
import { NotesTabComponent } from './tabs/notes-tab.component';
import { WorkOrderSidebarComponent } from './tabs/work-order-sidebar.component';
import { ExportButtonsComponent } from '../../shared/components/export-buttons/export-buttons.component';
@Component({
  selector: 'app-work-order-detail',
  imports: [MatIconModule, MatButtonModule, MatTabsModule, MatProgressSpinnerModule, StatusBadgeComponent, ErrorStateComponent, TrackingCodeComponent, TranslatePipe, StatusTransitionComponent, InfoTabComponent, TasksTabComponent, MaterialsTabComponent, NotesTabComponent, WorkOrderSidebarComponent, ExportButtonsComponent],
  template: `
    @if (workOrderResource.status() === 'loading' && !workOrderResource.hasValue()) {
      <div class="flex justify-center py-12">
        <mat-spinner diameter="48" />
      </div>
    } @else if (workOrderResource.error()) {
      <app-error-state
        [title]="'workOrders.detail.loadError' | translate"
        [message]="'workOrders.detail.loadErrorMessage' | translate"
        (retry)="workOrderResource.reload()"
      />
    } @else if (workOrderResource.hasValue()) {
      <div class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-4">
            <button mat-icon-button (click)="goBack()">
              <mat-icon>arrow_back</mat-icon>
            </button>
            <div>
              <div class="flex items-center gap-3">
                <h1 class="text-2xl font-bold text-gray-900 dark:text-gray-100">
                  <app-tracking-code [code]="workOrderResource.value().trackingCode" />
                </h1>
                <app-status-badge
                  [value]="workOrderResource.value().status"
                  type="workOrderStatus"
                />
                <app-status-badge
                  [value]="workOrderResource.value().priority"
                  type="workOrderPriority"
                />
              </div>
              <p class="text-gray-500 dark:text-gray-400 mt-1">
                {{ workOrderResource.value().serviceType.name }} -
                {{ workOrderResource.value().client.name }}
              </p>
            </div>
          </div>

          <div class="flex items-center gap-2">
            <app-export-buttons [workOrderId]="workOrderResource.value().id" />
            <app-status-transition
              [status]="workOrderResource.value().status"
              (transition)="onStatusTransition($event)"
              (openTechnicianAssignment)="openTechnicianDialog()"
            />
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <mat-tab-group>
              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">info</mat-icon>
                  {{ 'workOrders.detail.generalInfo' | translate }}
                </ng-template>
                <app-info-tab [workOrder]="workOrderResource.value()" />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">checklist</mat-icon>
                  {{ 'workOrders.detail.tasks' | translate }} ({{ getCompletedTasks() }}/{{
                    workOrderResource.value().tasks?.length || 0
                  }})
                </ng-template>
                <app-tasks-tab
                  [tasks]="workOrderResource.value().tasks || []"
                  [completedCount]="getCompletedTasks()"
                  (addTask)="openAddTaskDialog()"
                  (toggleTask)="onToggleTask($event)"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">build</mat-icon>
                  {{ 'workOrders.detail.materials' | translate }}
                </ng-template>
                <app-materials-tab
                  [materials]="workOrderResource.value().materials || []"
                  [total]="getMaterialsTotal()"
                  (addMaterial)="openAddMaterialDialog()"
                />
              </mat-tab>

              <mat-tab>
                <ng-template mat-tab-label>
                  <mat-icon class="mr-2">notes</mat-icon>
                  {{ 'workOrders.detail.notes' | translate }}
                </ng-template>
                <app-notes-tab
                  [notes]="workOrderResource.value().notes || []"
                  (addNote)="openAddNoteDialog()"
                />
              </mat-tab>
            </mat-tab-group>
          </div>

          <app-work-order-sidebar
            [technicians]="workOrderResource.value().technicians"
            [completedTasks]="getCompletedTasks()"
            [totalTasks]="workOrderResource.value().tasks?.length || 0"
            [materialsTotal]="getMaterialsTotal()"
            [createdAt]="workOrderResource.value().createdAt"
            (editTechnicians)="openTechnicianDialog()"
          />
        </div>
      </div>
    }
  `
})
export class WorkOrderDetailComponent {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly workOrdersService = inject(WorkOrdersService);
  private readonly dialog = inject(MatDialog);
  readonly orderId = signal(stryMutAct_9fa48("5493") ? this.route.snapshot.paramMap.get('id') && '' : stryMutAct_9fa48("5492") ? false : stryMutAct_9fa48("5491") ? true : (stryCov_9fa48("5491", "5492", "5493"), this.route.snapshot.paramMap.get(stryMutAct_9fa48("5494") ? "" : (stryCov_9fa48("5494"), 'id')) || (stryMutAct_9fa48("5495") ? "Stryker was here!" : (stryCov_9fa48("5495"), ''))));
  readonly workOrderResource = httpResource<WorkOrder>(stryMutAct_9fa48("5496") ? () => undefined : (stryCov_9fa48("5496"), () => stryMutAct_9fa48("5497") ? {} : (stryCov_9fa48("5497"), {
    url: stryMutAct_9fa48("5498") ? `` : (stryCov_9fa48("5498"), `/api/work-orders/${this.orderId()}`)
  })));
  getCompletedTasks(): number {
    if (stryMutAct_9fa48("5499")) {
      {}
    } else {
      stryCov_9fa48("5499");
      return stryMutAct_9fa48("5502") ? this.workOrderResource.value()?.tasks?.filter(t => t.isCompleted).length && 0 : stryMutAct_9fa48("5501") ? false : stryMutAct_9fa48("5500") ? true : (stryCov_9fa48("5500", "5501", "5502"), (stryMutAct_9fa48("5505") ? this.workOrderResource.value().tasks?.filter(t => t.isCompleted).length : stryMutAct_9fa48("5504") ? this.workOrderResource.value()?.tasks.filter(t => t.isCompleted).length : stryMutAct_9fa48("5503") ? this.workOrderResource.value()?.tasks.length : (stryCov_9fa48("5503", "5504", "5505"), this.workOrderResource.value()?.tasks?.filter(stryMutAct_9fa48("5506") ? () => undefined : (stryCov_9fa48("5506"), t => t.isCompleted)).length)) || 0);
    }
  }
  getMaterialsTotal(): number {
    if (stryMutAct_9fa48("5507")) {
      {}
    } else {
      stryCov_9fa48("5507");
      return stryMutAct_9fa48("5510") ? this.workOrderResource.value()?.materials?.reduce((sum, m) => sum + m.totalCost, 0) && 0 : stryMutAct_9fa48("5509") ? false : stryMutAct_9fa48("5508") ? true : (stryCov_9fa48("5508", "5509", "5510"), (stryMutAct_9fa48("5512") ? this.workOrderResource.value().materials?.reduce((sum, m) => sum + m.totalCost, 0) : stryMutAct_9fa48("5511") ? this.workOrderResource.value()?.materials.reduce((sum, m) => sum + m.totalCost, 0) : (stryCov_9fa48("5511", "5512"), this.workOrderResource.value()?.materials?.reduce(stryMutAct_9fa48("5513") ? () => undefined : (stryCov_9fa48("5513"), (sum, m) => stryMutAct_9fa48("5514") ? sum - m.totalCost : (stryCov_9fa48("5514"), sum + m.totalCost)), 0))) || 0);
    }
  }
  goBack(): void {
    if (stryMutAct_9fa48("5515")) {
      {}
    } else {
      stryCov_9fa48("5515");
      this.router.navigate(stryMutAct_9fa48("5516") ? [] : (stryCov_9fa48("5516"), [stryMutAct_9fa48("5517") ? "" : (stryCov_9fa48("5517"), '/admin/work-orders')]));
    }
  }
  onToggleTask(event: {
    taskId: string;
    isCompleted: boolean;
  }): void {
    if (stryMutAct_9fa48("5518")) {
      {}
    } else {
      stryCov_9fa48("5518");
      const id = stryMutAct_9fa48("5519") ? this.workOrderResource.value().id : (stryCov_9fa48("5519"), this.workOrderResource.value()?.id);
      if (stryMutAct_9fa48("5521") ? false : stryMutAct_9fa48("5520") ? true : (stryCov_9fa48("5520", "5521"), id)) {
        if (stryMutAct_9fa48("5522")) {
          {}
        } else {
          stryCov_9fa48("5522");
          this.workOrdersService.updateTask(id, event.taskId, stryMutAct_9fa48("5523") ? {} : (stryCov_9fa48("5523"), {
            isCompleted: event.isCompleted
          })).subscribe(stryMutAct_9fa48("5524") ? {} : (stryCov_9fa48("5524"), {
            next: stryMutAct_9fa48("5525") ? () => undefined : (stryCov_9fa48("5525"), () => this.workOrderResource.reload())
          }));
        }
      }
    }
  }
  onStatusTransition(event: {
    status: WorkOrderStatus;
    startedAt?: string;
    completedAt?: string;
  }): void {
    if (stryMutAct_9fa48("5526")) {
      {}
    } else {
      stryCov_9fa48("5526");
      const id = stryMutAct_9fa48("5527") ? this.workOrderResource.value().id : (stryCov_9fa48("5527"), this.workOrderResource.value()?.id);
      if (stryMutAct_9fa48("5530") ? false : stryMutAct_9fa48("5529") ? true : stryMutAct_9fa48("5528") ? id : (stryCov_9fa48("5528", "5529", "5530"), !id)) return;
      const dto: UpdateWorkOrderDto = stryMutAct_9fa48("5531") ? {} : (stryCov_9fa48("5531"), {
        status: event.status
      });
      if (stryMutAct_9fa48("5533") ? false : stryMutAct_9fa48("5532") ? true : (stryCov_9fa48("5532", "5533"), event.startedAt)) dto.startedAt = event.startedAt;
      if (stryMutAct_9fa48("5535") ? false : stryMutAct_9fa48("5534") ? true : (stryCov_9fa48("5534", "5535"), event.completedAt)) dto.completedAt = event.completedAt;
      this.workOrdersService.update(id, dto).subscribe(stryMutAct_9fa48("5536") ? {} : (stryCov_9fa48("5536"), {
        next: stryMutAct_9fa48("5537") ? () => undefined : (stryCov_9fa48("5537"), () => this.workOrderResource.reload())
      }));
    }
  }
  openTechnicianDialog(): void {
    if (stryMutAct_9fa48("5538")) {
      {}
    } else {
      stryCov_9fa48("5538");
      const workOrder = this.workOrderResource.value();
      if (stryMutAct_9fa48("5541") ? false : stryMutAct_9fa48("5540") ? true : stryMutAct_9fa48("5539") ? workOrder : (stryCov_9fa48("5539", "5540", "5541"), !workOrder)) return;
      const dialogRef = this.dialog.open(TechnicianAssignmentDialogComponent, stryMutAct_9fa48("5542") ? {} : (stryCov_9fa48("5542"), {
        width: stryMutAct_9fa48("5543") ? "" : (stryCov_9fa48("5543"), '500px'),
        data: stryMutAct_9fa48("5544") ? {} : (stryCov_9fa48("5544"), {
          workOrderId: workOrder.id,
          currentTechnicianIds: workOrder.technicians.map(stryMutAct_9fa48("5545") ? () => undefined : (stryCov_9fa48("5545"), t => t.id))
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("5546")) {
          {}
        } else {
          stryCov_9fa48("5546");
          if (stryMutAct_9fa48("5548") ? false : stryMutAct_9fa48("5547") ? true : (stryCov_9fa48("5547", "5548"), result)) this.workOrderResource.reload();
        }
      });
    }
  }
  openAddNoteDialog(): void {
    if (stryMutAct_9fa48("5549")) {
      {}
    } else {
      stryCov_9fa48("5549");
      const workOrder = this.workOrderResource.value();
      if (stryMutAct_9fa48("5552") ? false : stryMutAct_9fa48("5551") ? true : stryMutAct_9fa48("5550") ? workOrder : (stryCov_9fa48("5550", "5551", "5552"), !workOrder)) return;
      const dialogRef = this.dialog.open(AddNoteDialogComponent, stryMutAct_9fa48("5553") ? {} : (stryCov_9fa48("5553"), {
        width: stryMutAct_9fa48("5554") ? "" : (stryCov_9fa48("5554"), '500px'),
        data: stryMutAct_9fa48("5555") ? {} : (stryCov_9fa48("5555"), {
          workOrderId: workOrder.id
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("5556")) {
          {}
        } else {
          stryCov_9fa48("5556");
          if (stryMutAct_9fa48("5558") ? false : stryMutAct_9fa48("5557") ? true : (stryCov_9fa48("5557", "5558"), result)) this.workOrderResource.reload();
        }
      });
    }
  }
  openAddMaterialDialog(): void {
    if (stryMutAct_9fa48("5559")) {
      {}
    } else {
      stryCov_9fa48("5559");
      const workOrder = this.workOrderResource.value();
      if (stryMutAct_9fa48("5562") ? false : stryMutAct_9fa48("5561") ? true : stryMutAct_9fa48("5560") ? workOrder : (stryCov_9fa48("5560", "5561", "5562"), !workOrder)) return;
      const dialogRef = this.dialog.open(AddMaterialDialogComponent, stryMutAct_9fa48("5563") ? {} : (stryCov_9fa48("5563"), {
        width: stryMutAct_9fa48("5564") ? "" : (stryCov_9fa48("5564"), '500px'),
        data: stryMutAct_9fa48("5565") ? {} : (stryCov_9fa48("5565"), {
          workOrderId: workOrder.id
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("5566")) {
          {}
        } else {
          stryCov_9fa48("5566");
          if (stryMutAct_9fa48("5568") ? false : stryMutAct_9fa48("5567") ? true : (stryCov_9fa48("5567", "5568"), result)) this.workOrderResource.reload();
        }
      });
    }
  }
  openAddTaskDialog(): void {
    if (stryMutAct_9fa48("5569")) {
      {}
    } else {
      stryCov_9fa48("5569");
      const workOrder = this.workOrderResource.value();
      if (stryMutAct_9fa48("5572") ? false : stryMutAct_9fa48("5571") ? true : stryMutAct_9fa48("5570") ? workOrder : (stryCov_9fa48("5570", "5571", "5572"), !workOrder)) return;
      const dialogRef = this.dialog.open(AddTaskDialogComponent, stryMutAct_9fa48("5573") ? {} : (stryCov_9fa48("5573"), {
        width: stryMutAct_9fa48("5574") ? "" : (stryCov_9fa48("5574"), '500px'),
        data: stryMutAct_9fa48("5575") ? {} : (stryCov_9fa48("5575"), {
          workOrderId: workOrder.id
        })
      }));
      dialogRef.afterClosed().subscribe(result => {
        if (stryMutAct_9fa48("5576")) {
          {}
        } else {
          stryCov_9fa48("5576");
          if (stryMutAct_9fa48("5578") ? false : stryMutAct_9fa48("5577") ? true : (stryCov_9fa48("5577", "5578"), result)) this.workOrderResource.reload();
        }
      });
    }
  }
}