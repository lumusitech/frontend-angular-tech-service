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
const ACTIONS_BY_STATUS: Record<WorkOrderStatus, StatusAction[]> = stryMutAct_9fa48("5375") ? {} : (stryCov_9fa48("5375"), {
  pending: stryMutAct_9fa48("5376") ? [] : (stryCov_9fa48("5376"), [stryMutAct_9fa48("5377") ? {} : (stryCov_9fa48("5377"), {
    label: stryMutAct_9fa48("5378") ? "" : (stryCov_9fa48("5378"), 'Asignar Técnicos'),
    icon: stryMutAct_9fa48("5379") ? "" : (stryCov_9fa48("5379"), 'engineering'),
    color: stryMutAct_9fa48("5380") ? "" : (stryCov_9fa48("5380"), 'primary'),
    nextStatus: stryMutAct_9fa48("5381") ? "" : (stryCov_9fa48("5381"), 'assigned')
  })]),
  assigned: stryMutAct_9fa48("5382") ? [] : (stryCov_9fa48("5382"), [stryMutAct_9fa48("5383") ? {} : (stryCov_9fa48("5383"), {
    label: stryMutAct_9fa48("5384") ? "" : (stryCov_9fa48("5384"), 'Iniciar Trabajo'),
    icon: stryMutAct_9fa48("5385") ? "" : (stryCov_9fa48("5385"), 'play_arrow'),
    color: stryMutAct_9fa48("5386") ? "" : (stryCov_9fa48("5386"), 'primary'),
    nextStatus: stryMutAct_9fa48("5387") ? "" : (stryCov_9fa48("5387"), 'in_progress'),
    setStartedAt: stryMutAct_9fa48("5388") ? false : (stryCov_9fa48("5388"), true)
  })]),
  in_progress: stryMutAct_9fa48("5389") ? [] : (stryCov_9fa48("5389"), [stryMutAct_9fa48("5390") ? {} : (stryCov_9fa48("5390"), {
    label: stryMutAct_9fa48("5391") ? "" : (stryCov_9fa48("5391"), 'Completar'),
    icon: stryMutAct_9fa48("5392") ? "" : (stryCov_9fa48("5392"), 'check_circle'),
    color: stryMutAct_9fa48("5393") ? "" : (stryCov_9fa48("5393"), 'primary'),
    nextStatus: stryMutAct_9fa48("5394") ? "" : (stryCov_9fa48("5394"), 'completed'),
    setCompletedAt: stryMutAct_9fa48("5395") ? false : (stryCov_9fa48("5395"), true)
  }), stryMutAct_9fa48("5396") ? {} : (stryCov_9fa48("5396"), {
    label: stryMutAct_9fa48("5397") ? "" : (stryCov_9fa48("5397"), 'Pausar'),
    icon: stryMutAct_9fa48("5398") ? "" : (stryCov_9fa48("5398"), 'pause'),
    color: stryMutAct_9fa48("5399") ? "Stryker was here!" : (stryCov_9fa48("5399"), ''),
    nextStatus: stryMutAct_9fa48("5400") ? "" : (stryCov_9fa48("5400"), 'postponed')
  }), stryMutAct_9fa48("5401") ? {} : (stryCov_9fa48("5401"), {
    label: stryMutAct_9fa48("5402") ? "" : (stryCov_9fa48("5402"), 'Cancelar'),
    icon: stryMutAct_9fa48("5403") ? "" : (stryCov_9fa48("5403"), 'cancel'),
    color: stryMutAct_9fa48("5404") ? "" : (stryCov_9fa48("5404"), 'warn'),
    nextStatus: stryMutAct_9fa48("5405") ? "" : (stryCov_9fa48("5405"), 'cancelled')
  })]),
  postponed: stryMutAct_9fa48("5406") ? [] : (stryCov_9fa48("5406"), [stryMutAct_9fa48("5407") ? {} : (stryCov_9fa48("5407"), {
    label: stryMutAct_9fa48("5408") ? "" : (stryCov_9fa48("5408"), 'Reanudar'),
    icon: stryMutAct_9fa48("5409") ? "" : (stryCov_9fa48("5409"), 'play_arrow'),
    color: stryMutAct_9fa48("5410") ? "" : (stryCov_9fa48("5410"), 'primary'),
    nextStatus: stryMutAct_9fa48("5411") ? "" : (stryCov_9fa48("5411"), 'in_progress')
  }), stryMutAct_9fa48("5412") ? {} : (stryCov_9fa48("5412"), {
    label: stryMutAct_9fa48("5413") ? "" : (stryCov_9fa48("5413"), 'Cancelar'),
    icon: stryMutAct_9fa48("5414") ? "" : (stryCov_9fa48("5414"), 'cancel'),
    color: stryMutAct_9fa48("5415") ? "" : (stryCov_9fa48("5415"), 'warn'),
    nextStatus: stryMutAct_9fa48("5416") ? "" : (stryCov_9fa48("5416"), 'cancelled')
  })]),
  completed: stryMutAct_9fa48("5417") ? [] : (stryCov_9fa48("5417"), [stryMutAct_9fa48("5418") ? {} : (stryCov_9fa48("5418"), {
    label: stryMutAct_9fa48("5419") ? "" : (stryCov_9fa48("5419"), 'Entregar'),
    icon: stryMutAct_9fa48("5420") ? "" : (stryCov_9fa48("5420"), 'done_all'),
    color: stryMutAct_9fa48("5421") ? "" : (stryCov_9fa48("5421"), 'primary'),
    nextStatus: stryMutAct_9fa48("5422") ? "" : (stryCov_9fa48("5422"), 'delivered')
  })]),
  delivered: stryMutAct_9fa48("5423") ? ["Stryker was here"] : (stryCov_9fa48("5423"), []),
  cancelled: stryMutAct_9fa48("5424") ? ["Stryker was here"] : (stryCov_9fa48("5424"), [])
});
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
  `
})
export class StatusTransitionComponent {
  private readonly dialog = inject(MatDialog);
  status = input.required<WorkOrderStatus>();
  transition = output<{
    status: WorkOrderStatus;
    startedAt?: string;
    completedAt?: string;
  }>();
  openTechnicianAssignment = output<void>();
  actions(): StatusAction[] {
    if (stryMutAct_9fa48("5425")) {
      {}
    } else {
      stryCov_9fa48("5425");
      return stryMutAct_9fa48("5428") ? ACTIONS_BY_STATUS[this.status()] && [] : stryMutAct_9fa48("5427") ? false : stryMutAct_9fa48("5426") ? true : (stryCov_9fa48("5426", "5427", "5428"), ACTIONS_BY_STATUS[this.status()] || (stryMutAct_9fa48("5429") ? ["Stryker was here"] : (stryCov_9fa48("5429"), [])));
    }
  }
  getActionLabel(label: string): string {
    if (stryMutAct_9fa48("5430")) {
      {}
    } else {
      stryCov_9fa48("5430");
      const labelMap: Record<string, string> = stryMutAct_9fa48("5431") ? {} : (stryCov_9fa48("5431"), {
        'Asignar Técnicos': stryMutAct_9fa48("5432") ? "" : (stryCov_9fa48("5432"), 'workOrders.actions.assignTechnicians'),
        'Iniciar Trabajo': stryMutAct_9fa48("5433") ? "" : (stryCov_9fa48("5433"), 'workOrders.actions.startWork'),
        Completar: stryMutAct_9fa48("5434") ? "" : (stryCov_9fa48("5434"), 'workOrders.actions.complete'),
        Pausar: stryMutAct_9fa48("5435") ? "" : (stryCov_9fa48("5435"), 'workOrders.actions.pause'),
        Cancelar: stryMutAct_9fa48("5436") ? "" : (stryCov_9fa48("5436"), 'workOrders.actions.cancel'),
        Reanudar: stryMutAct_9fa48("5437") ? "" : (stryCov_9fa48("5437"), 'workOrders.actions.resume'),
        Entregar: stryMutAct_9fa48("5438") ? "" : (stryCov_9fa48("5438"), 'workOrders.actions.deliver')
      });
      return stryMutAct_9fa48("5441") ? labelMap[label] && label : stryMutAct_9fa48("5440") ? false : stryMutAct_9fa48("5439") ? true : (stryCov_9fa48("5439", "5440", "5441"), labelMap[label] || label);
    }
  }
  onAction(action: StatusAction): void {
    if (stryMutAct_9fa48("5442")) {
      {}
    } else {
      stryCov_9fa48("5442");
      if (stryMutAct_9fa48("5445") ? action.nextStatus !== 'cancelled' : stryMutAct_9fa48("5444") ? false : stryMutAct_9fa48("5443") ? true : (stryCov_9fa48("5443", "5444", "5445"), action.nextStatus === (stryMutAct_9fa48("5446") ? "" : (stryCov_9fa48("5446"), 'cancelled')))) {
        if (stryMutAct_9fa48("5447")) {
          {}
        } else {
          stryCov_9fa48("5447");
          const dialogRef = this.dialog.open(ConfirmDialogComponent, stryMutAct_9fa48("5448") ? {} : (stryCov_9fa48("5448"), {
            width: stryMutAct_9fa48("5449") ? "" : (stryCov_9fa48("5449"), '400px'),
            data: stryMutAct_9fa48("5450") ? {} : (stryCov_9fa48("5450"), {
              title: stryMutAct_9fa48("5451") ? "" : (stryCov_9fa48("5451"), 'Cancelar orden'),
              message: stryMutAct_9fa48("5452") ? "" : (stryCov_9fa48("5452"), '¿Estás seguro de cancelar esta orden? Esta acción no se puede deshacer.'),
              confirmLabel: stryMutAct_9fa48("5453") ? "" : (stryCov_9fa48("5453"), 'Cancelar Orden'),
              color: stryMutAct_9fa48("5454") ? "" : (stryCov_9fa48("5454"), 'warn')
            })
          }));
          dialogRef.afterClosed().subscribe(confirmed => {
            if (stryMutAct_9fa48("5455")) {
              {}
            } else {
              stryCov_9fa48("5455");
              if (stryMutAct_9fa48("5457") ? false : stryMutAct_9fa48("5456") ? true : (stryCov_9fa48("5456", "5457"), confirmed)) {
                if (stryMutAct_9fa48("5458")) {
                  {}
                } else {
                  stryCov_9fa48("5458");
                  this.emitTransition(action);
                }
              }
            }
          });
        }
      } else if (stryMutAct_9fa48("5461") ? action.label !== 'Asignar Técnicos' : stryMutAct_9fa48("5460") ? false : stryMutAct_9fa48("5459") ? true : (stryCov_9fa48("5459", "5460", "5461"), action.label === (stryMutAct_9fa48("5462") ? "" : (stryCov_9fa48("5462"), 'Asignar Técnicos')))) {
        if (stryMutAct_9fa48("5463")) {
          {}
        } else {
          stryCov_9fa48("5463");
          this.openTechnicianAssignment.emit();
        }
      } else {
        if (stryMutAct_9fa48("5464")) {
          {}
        } else {
          stryCov_9fa48("5464");
          this.emitTransition(action);
        }
      }
    }
  }
  private emitTransition(action: StatusAction): void {
    if (stryMutAct_9fa48("5465")) {
      {}
    } else {
      stryCov_9fa48("5465");
      const payload: {
        status: WorkOrderStatus;
        startedAt?: string;
        completedAt?: string;
      } = stryMutAct_9fa48("5466") ? {} : (stryCov_9fa48("5466"), {
        status: action.nextStatus
      });
      if (stryMutAct_9fa48("5468") ? false : stryMutAct_9fa48("5467") ? true : (stryCov_9fa48("5467", "5468"), action.setStartedAt)) {
        if (stryMutAct_9fa48("5469")) {
          {}
        } else {
          stryCov_9fa48("5469");
          payload.startedAt = new Date().toISOString();
        }
      }
      if (stryMutAct_9fa48("5471") ? false : stryMutAct_9fa48("5470") ? true : (stryCov_9fa48("5470", "5471"), action.setCompletedAt)) {
        if (stryMutAct_9fa48("5472")) {
          {}
        } else {
          stryCov_9fa48("5472");
          payload.completedAt = new Date().toISOString();
        }
      }
      this.transition.emit(payload);
    }
  }
}