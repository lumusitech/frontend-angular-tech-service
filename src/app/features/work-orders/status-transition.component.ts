import { Component, input, output, inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrderStatus } from '../../core/models/work-order.interfaces';
import {
  StatusChangeDialogComponent,
  StatusChangeDialogResult,
} from '../../shared/components/status-change-dialog/status-change-dialog.component';
import { TranslatePipe } from '../../shared/pipes/translate.pipe';

interface StatusAction {
  label: string;
  icon: string;
  color: string;
  nextStatus: WorkOrderStatus;
  setStartedAt?: boolean;
  setCompletedAt?: boolean;
}

const ACTIONS_BY_STATUS: Record<WorkOrderStatus, StatusAction[]> = {
  pending: [
    {
      label: 'Iniciar Trabajo',
      icon: 'play_arrow',
      color: 'primary',
      nextStatus: 'in_progress',
      setStartedAt: true,
    },
    { label: 'Pausar', icon: 'pause', color: '', nextStatus: 'postponed' },
    { label: 'Cancelar', icon: 'cancel', color: 'warn', nextStatus: 'cancelled' },
  ],
  assigned: [
    {
      label: 'Iniciar Trabajo',
      icon: 'play_arrow',
      color: 'primary',
      nextStatus: 'in_progress',
      setStartedAt: true,
    },
    { label: 'Pausar', icon: 'pause', color: '', nextStatus: 'postponed' },
    { label: 'Cancelar', icon: 'cancel', color: 'warn', nextStatus: 'cancelled' },
  ],
  on_the_way: [{ label: 'Cancelar', icon: 'cancel', color: 'warn', nextStatus: 'cancelled' }],
  in_progress: [
    {
      label: 'Completar',
      icon: 'check_circle',
      color: 'primary',
      nextStatus: 'completed',
      setCompletedAt: true,
    },
    { label: 'Pausar', icon: 'pause', color: '', nextStatus: 'postponed' },
    { label: 'Cancelar', icon: 'cancel', color: 'warn', nextStatus: 'cancelled' },
  ],
  postponed: [
    { label: 'Reanudar', icon: 'play_arrow', color: 'primary', nextStatus: 'in_progress' },
    { label: 'Cancelar', icon: 'cancel', color: 'warn', nextStatus: 'cancelled' },
  ],
  completed: [
    { label: 'Entregar', icon: 'done_all', color: 'primary', nextStatus: 'delivered' },
    { label: 'Reabrir', icon: 'replay', color: '', nextStatus: 'in_progress' },
  ],
  delivered: [],
  cancelled: [{ label: 'Reabrir', icon: 'replay', color: 'primary', nextStatus: 'pending' }],
};

@Component({
  selector: 'app-status-transition',
  imports: [MatIconModule, MatTooltipModule, TranslatePipe],
  template: `
    <div class="flex items-center gap-2 shrink-0 py-0.5">
      @for (action of actions(); track action.nextStatus; let first = $first) {
        @if (first && action.color === 'primary') {
          <!-- Primary Hero Action Button -->
          <button
            type="button"
            (click)="onAction(action)"
            [matTooltip]="getActionLabel(action.label) | translate"
            class="px-4 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 dark:from-blue-500 dark:to-indigo-600 shadow-md shadow-blue-500/20 active:scale-95 transition-all inline-flex items-center gap-2 shrink-0 min-h-11 cursor-pointer"
          >
            <div class="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center shrink-0">
              <mat-icon
                class="w-4.5! h-4.5! text-base! text-white leading-none flex items-center justify-center"
                >{{ action.icon }}</mat-icon
              >
            </div>
            <span>{{ getActionLabel(action.label) | translate }}</span>
          </button>
        } @else if (action.color === 'warn') {
          <!-- Danger Action (Cancelar) -->
          <button
            type="button"
            (click)="onAction(action)"
            [matTooltip]="getActionLabel(action.label) | translate"
            class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 hover:bg-rose-100 dark:hover:bg-rose-900/60 active:scale-95 transition-all inline-flex items-center gap-1.5 shrink-0 min-h-11 cursor-pointer"
          >
            <mat-icon
              class="w-4.5! h-4.5! text-lg! text-rose-600 dark:text-rose-400 leading-none flex items-center justify-center shrink-0"
              >{{ action.icon }}</mat-icon
            >
            <span>{{ getActionLabel(action.label) | translate }}</span>
          </button>
        } @else {
          <!-- Secondary / Neutral Action (Pausar, Reabrir, etc.) -->
          <button
            type="button"
            (click)="onAction(action)"
            [matTooltip]="getActionLabel(action.label) | translate"
            class="px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-200 bg-gray-100 dark:bg-gray-800 border border-gray-200 dark:border-gray-700/80 hover:bg-gray-200 dark:hover:bg-gray-700 active:scale-95 transition-all inline-flex items-center gap-1.5 shrink-0 min-h-11 cursor-pointer"
          >
            <mat-icon
              class="w-4.5! h-4.5! text-lg! text-gray-500 dark:text-gray-400 leading-none flex items-center justify-center shrink-0"
              >{{ action.icon }}</mat-icon
            >
            <span>{{ getActionLabel(action.label) | translate }}</span>
          </button>
        }
      }
    </div>
  `,
})
export class StatusTransitionComponent {
  private readonly dialog = inject(MatDialog);

  status = input.required<WorkOrderStatus>();
  requiresDelivery = input(false);
  transition = output<{
    status: WorkOrderStatus;
    startedAt?: string;
    completedAt?: string;
    statusDetail?: string;
  }>();
  openTechnicianAssignment = output<void>();

  actions(): StatusAction[] {
    const all = ACTIONS_BY_STATUS[this.status()] || [];
    let filtered = all;
    if (!this.requiresDelivery() && this.status() === 'assigned') {
      filtered = [
        {
          label: 'En Camino',
          icon: 'directions_car',
          color: 'primary',
          nextStatus: 'on_the_way',
        },
        { label: 'Cancelar', icon: 'cancel', color: 'warn', nextStatus: 'cancelled' },
      ];
    }
    if (!this.requiresDelivery()) {
      filtered = filtered.filter((a) => a.nextStatus !== 'delivered');
    }
    return filtered;
  }

  getActionLabel(label: string): string {
    const labelMap: Record<string, string> = {
      'Asignar Técnicos': 'workOrders.actions.assignTechnicians',
      'Iniciar Trabajo': 'workOrders.actions.startWork',
      'En Camino': 'workOrders.actions.onTheWay',
      Completar: 'workOrders.actions.complete',
      Pausar: 'workOrders.actions.pause',
      Reabrir: 'workOrders.actions.reopen',
      Cancelar: 'workOrders.actions.cancel',
      Reanudar: 'workOrders.actions.resume',
      Entregar: 'workOrders.actions.deliver',
    };
    return labelMap[label] || label;
  }

  onAction(action: StatusAction): void {
    if (action.label === 'Asignar Técnicos') {
      this.openTechnicianAssignment.emit();
      return;
    }

    const isCancellation = action.nextStatus === 'cancelled';
    const dialogRef = this.dialog.open(StatusChangeDialogComponent, {
      width: '420px',
      data: {
        titleKey: 'workOrders.changeStatus',
        message: isCancellation
          ? '¿Estás seguro de cancelar esta orden? Esta acción no se puede deshacer.'
          : `¿Cambiar estado a "${action.label}"?`,
        confirmLabel: isCancellation ? 'workOrders.actions.cancel' : action.label,
        color: isCancellation ? 'warn' : 'primary',
      },
    });

    dialogRef.afterClosed().subscribe((result: StatusChangeDialogResult | undefined) => {
      if (result?.confirmed) {
        this.emitTransition(action, result.detail);
      }
    });
  }

  private emitTransition(action: StatusAction, statusDetail?: string): void {
    const payload: {
      status: WorkOrderStatus;
      startedAt?: string;
      completedAt?: string;
      statusDetail?: string;
    } = {
      status: action.nextStatus,
    };

    if (action.setStartedAt) {
      payload.startedAt = new Date().toISOString();
    }
    if (action.setCompletedAt) {
      payload.completedAt = new Date().toISOString();
    }
    if (statusDetail) {
      payload.statusDetail = statusDetail;
    }

    this.transition.emit(payload);
  }
}
