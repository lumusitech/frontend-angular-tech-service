import { Component, input, output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
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
    { label: 'Asignar Técnicos', icon: 'engineering', color: 'primary', nextStatus: 'assigned' },
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
    { label: 'Reabrir', icon: 'replay', color: '', nextStatus: 'in_progress' },
    { label: 'Entregar', icon: 'done_all', color: 'primary', nextStatus: 'delivered' },
  ],
  delivered: [],
  cancelled: [{ label: 'Reabrir', icon: 'replay', color: 'primary', nextStatus: 'pending' }],
};

@Component({
  selector: 'app-status-transition',
  imports: [MatButtonModule, MatIconModule, TranslatePipe],
  template: `
    <div class="flex items-center gap-2">
      @for (action of actions(); track action.nextStatus) {
        <button mat-flat-button [color]="action.color" (click)="onAction(action)" class="gap-1">
          <mat-icon>{{ action.icon }}</mat-icon>
          {{ getActionLabel(action.label) | translate }}
        </button>
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
