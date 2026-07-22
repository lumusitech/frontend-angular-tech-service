import { Component, input, output, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { WorkOrderStatus } from '../../core/models/work-order.interfaces';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
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
  cancelled: [
    { label: 'Reabrir', icon: 'replay', color: 'primary', nextStatus: 'pending' },
  ],
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
  transition = output<{ status: WorkOrderStatus; startedAt?: string; completedAt?: string }>();
  openTechnicianAssignment = output<void>();

  actions(): StatusAction[] {
    return ACTIONS_BY_STATUS[this.status()] || [];
  }

  getActionLabel(label: string): string {
    const labelMap: Record<string, string> = {
      'Asignar Técnicos': 'workOrders.actions.assignTechnicians',
      'Iniciar Trabajo': 'workOrders.actions.startWork',
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
    if (action.nextStatus === 'cancelled') {
      const dialogRef = this.dialog.open(ConfirmDialogComponent, {
        width: '400px',
        data: {
          title: 'Cancelar orden',
          message: '¿Estás seguro de cancelar esta orden? Esta acción no se puede deshacer.',
          confirmLabel: 'Cancelar Orden',
          color: 'warn',
        },
      });

      dialogRef.afterClosed().subscribe((confirmed) => {
        if (confirmed) {
          this.emitTransition(action);
        }
      });
    } else if (action.label === 'Asignar Técnicos') {
      this.openTechnicianAssignment.emit();
    } else {
      this.emitTransition(action);
    }
  }

  private emitTransition(action: StatusAction): void {
    const payload: { status: WorkOrderStatus; startedAt?: string; completedAt?: string } = {
      status: action.nextStatus,
    };

    if (action.setStartedAt) {
      payload.startedAt = new Date().toISOString();
    }
    if (action.setCompletedAt) {
      payload.completedAt = new Date().toISOString();
    }

    this.transition.emit(payload);
  }
}
