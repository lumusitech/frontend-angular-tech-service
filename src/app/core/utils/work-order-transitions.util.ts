import { WorkOrderStatus } from '../models/work-order.interfaces';

export interface WorkOrderTransitionAction {
  labelKey: string;
  icon: string;
  color: string;
  nextStatus: WorkOrderStatus;
  setStartedAt?: boolean;
  setCompletedAt?: boolean;
}

export const WORK_ORDER_TRANSITION_ACTIONS: Record<WorkOrderStatus, WorkOrderTransitionAction[]> = {
  pending: [
    {
      labelKey: 'workOrders.actions.startWork',
      icon: 'play_arrow',
      color: 'primary',
      nextStatus: 'in_progress',
      setStartedAt: true,
    },
    {
      labelKey: 'workOrders.actions.pause',
      icon: 'pause',
      color: '',
      nextStatus: 'postponed',
    },
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  assigned: [
    {
      labelKey: 'workOrders.actions.startWork',
      icon: 'play_arrow',
      color: 'primary',
      nextStatus: 'in_progress',
      setStartedAt: true,
    },
    {
      labelKey: 'workOrders.actions.pause',
      icon: 'pause',
      color: '',
      nextStatus: 'postponed',
    },
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  on_the_way: [
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  in_progress: [
    {
      labelKey: 'workOrders.actions.complete',
      icon: 'check_circle',
      color: 'primary',
      nextStatus: 'completed',
      setCompletedAt: true,
    },
    {
      labelKey: 'workOrders.actions.pause',
      icon: 'pause',
      color: '',
      nextStatus: 'postponed',
    },
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  postponed: [
    {
      labelKey: 'workOrders.actions.resume',
      icon: 'play_arrow',
      color: 'primary',
      nextStatus: 'in_progress',
    },
    {
      labelKey: 'workOrders.actions.cancel',
      icon: 'cancel',
      color: 'warn',
      nextStatus: 'cancelled',
    },
  ],
  completed: [
    {
      labelKey: 'workOrders.actions.deliver',
      icon: 'done_all',
      color: 'primary',
      nextStatus: 'delivered',
    },
    {
      labelKey: 'workOrders.actions.reopen',
      icon: 'replay',
      color: '',
      nextStatus: 'in_progress',
    },
  ],
  delivered: [],
  cancelled: [
    {
      labelKey: 'workOrders.actions.reopen',
      icon: 'replay',
      color: 'primary',
      nextStatus: 'pending',
    },
  ],
};

export function getTransitionActions(
  status: WorkOrderStatus,
  requiresDelivery: boolean,
): WorkOrderTransitionAction[] {
  const all = WORK_ORDER_TRANSITION_ACTIONS[status] || [];
  let filtered = all;

  if (!requiresDelivery && status === 'assigned') {
    filtered = [
      {
        labelKey: 'workOrders.actions.onTheWay',
        icon: 'directions_car',
        color: 'primary',
        nextStatus: 'on_the_way',
      },
      {
        labelKey: 'workOrders.actions.cancel',
        icon: 'cancel',
        color: 'warn',
        nextStatus: 'cancelled',
      },
    ];
  }

  if (!requiresDelivery) {
    filtered = filtered.filter((a) => a.nextStatus !== 'delivered');
  }

  return filtered;
}

export const VALID_WORK_ORDER_TRANSITIONS: Record<WorkOrderStatus, WorkOrderStatus[]> = {
  pending: ['assigned', 'postponed', 'cancelled'],
  assigned: ['on_the_way', 'in_progress', 'postponed', 'cancelled'],
  on_the_way: ['assigned', 'in_progress', 'cancelled'],
  in_progress: ['completed', 'postponed', 'cancelled'],
  postponed: ['assigned', 'in_progress', 'cancelled'],
  completed: ['delivered', 'in_progress'],
  delivered: [],
  cancelled: ['pending'],
};

export function getAllowedTargetStatuses(
  status: WorkOrderStatus,
  requiresDelivery: boolean,
): WorkOrderStatus[] {
  const allowed = VALID_WORK_ORDER_TRANSITIONS[status] || [];
  if (!requiresDelivery) {
    return allowed.filter((s) => s !== 'delivered');
  }
  return allowed;
}
