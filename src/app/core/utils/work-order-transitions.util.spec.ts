import { describe, it, expect } from 'vitest';
import {
  WORK_ORDER_TRANSITION_ACTIONS,
  getAllowedTargetStatuses,
  getTransitionActions,
} from './work-order-transitions.util';
import { WorkOrderStatus } from '../models/work-order.interfaces';

describe('work-order-transitions.util', () => {
  describe('WORK_ORDER_TRANSITION_ACTIONS', () => {
    it('should define actions for all 8 statuses', () => {
      const statuses: WorkOrderStatus[] = [
        'pending',
        'assigned',
        'on_the_way',
        'in_progress',
        'postponed',
        'completed',
        'delivered',
        'cancelled',
      ];
      for (const status of statuses) {
        expect(Array.isArray(WORK_ORDER_TRANSITION_ACTIONS[status])).toBe(true);
      }
    });

    it('should have empty actions for delivered', () => {
      expect(WORK_ORDER_TRANSITION_ACTIONS.delivered).toHaveLength(0);
    });

    it('should allow cancel from every non-terminal status', () => {
      const nonTerminal: WorkOrderStatus[] = [
        'pending',
        'assigned',
        'on_the_way',
        'in_progress',
        'postponed',
      ];
      for (const status of nonTerminal) {
        const targets = getAllowedTargetStatuses(status, false);
        expect(targets).toContain('cancelled');
      }
    });
  });

  describe('getTransitionActions', () => {
    it('should filter delivered action when requiresDelivery is false', () => {
      const actions = getTransitionActions('completed', false);
      expect(actions.some((a) => a.nextStatus === 'delivered')).toBe(false);
    });

    it('should keep delivered action when requiresDelivery is true', () => {
      const actions = getTransitionActions('completed', true);
      expect(actions.some((a) => a.nextStatus === 'delivered')).toBe(true);
    });

    it('should replace assigned actions with on_the_way when no delivery required', () => {
      const actions = getTransitionActions('assigned', false);
      expect(actions.some((a) => a.nextStatus === 'on_the_way')).toBe(true);
      expect(actions.some((a) => a.nextStatus === 'in_progress')).toBe(false);
    });

    it('should keep in_progress action for assigned when delivery required', () => {
      const actions = getTransitionActions('assigned', true);
      expect(actions.some((a) => a.nextStatus === 'in_progress')).toBe(true);
    });

    it('should expose the on_the_way action for assigned without delivery (UX)', () => {
      const actions = getTransitionActions('assigned', false);
      const labels = actions.map((a) => a.labelKey);
      expect(labels).toContain('workOrders.actions.onTheWay');
      expect(labels).toContain('workOrders.actions.cancel');
    });
  });

  describe('getAllowedTargetStatuses', () => {
    it('should allow pending -> assigned, postponed, cancelled', () => {
      const targets = getAllowedTargetStatuses('pending', false);
      expect(targets).toEqual(expect.arrayContaining(['assigned', 'postponed', 'cancelled']));
    });

    it('should allow assigned -> on_the_way, in_progress, postponed, cancelled', () => {
      const targets = getAllowedTargetStatuses('assigned', false);
      expect(targets).toEqual(
        expect.arrayContaining(['on_the_way', 'in_progress', 'postponed', 'cancelled']),
      );
    });

    it('should allow on_the_way -> assigned, in_progress, cancelled', () => {
      const targets = getAllowedTargetStatuses('on_the_way', false);
      expect(targets).toEqual(expect.arrayContaining(['assigned', 'in_progress', 'cancelled']));
    });

    it('should allow in_progress -> completed, postponed, cancelled', () => {
      const targets = getAllowedTargetStatuses('in_progress', false);
      expect(targets).toEqual(expect.arrayContaining(['completed', 'postponed', 'cancelled']));
    });

    it('should allow completed -> delivered when delivery required', () => {
      const targets = getAllowedTargetStatuses('completed', true);
      expect(targets).toContain('delivered');
    });

    it('should exclude delivered from completed when no delivery required', () => {
      const targets = getAllowedTargetStatuses('completed', false);
      expect(targets).not.toContain('delivered');
    });

    it('should allow cancelled -> pending (reopen)', () => {
      const targets = getAllowedTargetStatuses('cancelled', false);
      expect(targets).toContain('pending');
    });

    it('should return empty for delivered', () => {
      expect(getAllowedTargetStatuses('delivered', false)).toEqual([]);
    });
  });
});
