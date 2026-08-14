import { StatusClassPipe } from './status-class.pipe';

describe('StatusClassPipe', () => {
  let pipe: StatusClassPipe;

  beforeEach(() => {
    pipe = new StatusClassPipe();
  });

  it('should create', () => {
    expect(pipe).toBeTruthy();
  });

  describe('workOrderStatus', () => {
    it('should return yellow for pending', () => {
      expect(pipe.transform('pending', 'workOrderStatus')).toBe('bg-yellow-500/15 text-yellow-400');
    });

    it('should return blue for assigned', () => {
      expect(pipe.transform('assigned', 'workOrderStatus')).toBe('bg-blue-500/15 text-blue-400');
    });

    it('should return indigo for in_progress', () => {
      expect(pipe.transform('in_progress', 'workOrderStatus')).toBe(
        'bg-indigo-500/15 text-indigo-400',
      );
    });

    it('should return gray for postponed', () => {
      expect(pipe.transform('postponed', 'workOrderStatus')).toBe('bg-gray-500/15 text-gray-400');
    });

    it('should return green for completed', () => {
      expect(pipe.transform('completed', 'workOrderStatus')).toBe('bg-green-500/15 text-green-400');
    });

    it('should return emerald for delivered', () => {
      expect(pipe.transform('delivered', 'workOrderStatus')).toBe(
        'bg-emerald-500/15 text-emerald-400',
      );
    });

    it('should return red for cancelled', () => {
      expect(pipe.transform('cancelled', 'workOrderStatus')).toBe('bg-red-500/15 text-red-400');
    });
  });

  describe('workOrderPriority', () => {
    it('should return gray for low', () => {
      expect(pipe.transform('low', 'workOrderPriority')).toBe('bg-gray-500/15 text-gray-400');
    });

    it('should return blue for medium', () => {
      expect(pipe.transform('medium', 'workOrderPriority')).toBe('bg-blue-500/15 text-blue-400');
    });

    it('should return orange for high', () => {
      expect(pipe.transform('high', 'workOrderPriority')).toBe('bg-orange-500/15 text-orange-400');
    });

    it('should return red for urgent', () => {
      expect(pipe.transform('urgent', 'workOrderPriority')).toBe('bg-red-500/15 text-red-400');
    });
  });

  describe('paymentStatus', () => {
    it('should return yellow for pending', () => {
      expect(pipe.transform('pending', 'paymentStatus')).toBe('bg-yellow-500/15 text-yellow-400');
    });

    it('should return green for approved', () => {
      expect(pipe.transform('approved', 'paymentStatus')).toBe('bg-green-500/15 text-green-400');
    });

    it('should return red for rejected', () => {
      expect(pipe.transform('rejected', 'paymentStatus')).toBe('bg-red-500/15 text-red-400');
    });

    it('should return blue for refunded', () => {
      expect(pipe.transform('refunded', 'paymentStatus')).toBe('bg-blue-500/15 text-blue-400');
    });

    it('should return gray for cancelled', () => {
      expect(pipe.transform('cancelled', 'paymentStatus')).toBe('bg-gray-500/15 text-gray-400');
    });
  });

  describe('paymentMethod', () => {
    it('should return green for cash', () => {
      expect(pipe.transform('cash', 'paymentMethod')).toBe('bg-green-500/15 text-green-400');
    });

    it('should return blue for transfer', () => {
      expect(pipe.transform('transfer', 'paymentMethod')).toBe('bg-blue-500/15 text-blue-400');
    });

    it('should return purple for credit_card', () => {
      expect(pipe.transform('credit_card', 'paymentMethod')).toBe(
        'bg-purple-500/15 text-purple-400',
      );
    });

    it('should return orange for debit_card', () => {
      expect(pipe.transform('debit_card', 'paymentMethod')).toBe(
        'bg-orange-500/15 text-orange-400',
      );
    });
  });

  describe('expenseCategory', () => {
    it('should return correct class for each category', () => {
      expect(pipe.transform('rent', 'expenseCategory')).toBe('bg-purple-500/15 text-purple-400');
      expect(pipe.transform('utilities', 'expenseCategory')).toBe('bg-blue-500/15 text-blue-400');
      expect(pipe.transform('salaries', 'expenseCategory')).toBe('bg-green-500/15 text-green-400');
      expect(pipe.transform('tools', 'expenseCategory')).toBe('bg-orange-500/15 text-orange-400');
      expect(pipe.transform('transport', 'expenseCategory')).toBe(
        'bg-yellow-500/15 text-yellow-400',
      );
      expect(pipe.transform('advertising', 'expenseCategory')).toBe('bg-pink-500/15 text-pink-400');
      expect(pipe.transform('supplies', 'expenseCategory')).toBe(
        'bg-indigo-500/15 text-indigo-400',
      );
      expect(pipe.transform('maintenance', 'expenseCategory')).toBe('bg-red-500/15 text-red-400');
      expect(pipe.transform('hosting', 'expenseCategory')).toBe('bg-cyan-500/15 text-cyan-400');
      expect(pipe.transform('other', 'expenseCategory')).toBe('bg-gray-500/15 text-gray-400');
    });
  });

  describe('noteType', () => {
    it('should return blue for diagnosis', () => {
      expect(pipe.transform('diagnosis', 'noteType')).toBe('bg-blue-500/15 text-blue-400');
    });

    it('should return red for issue', () => {
      expect(pipe.transform('issue', 'noteType')).toBe('bg-red-500/15 text-red-400');
    });

    it('should return gray for observation', () => {
      expect(pipe.transform('observation', 'noteType')).toBe('bg-gray-500/15 text-gray-400');
    });

    it('should return yellow for internal', () => {
      expect(pipe.transform('internal', 'noteType')).toBe('bg-yellow-500/15 text-yellow-400');
    });
  });

  describe('activeInactive', () => {
    it('should return green for true', () => {
      expect(pipe.transform('true', 'activeInactive')).toBe('bg-green-500/15 text-green-400');
    });

    it('should return gray for false', () => {
      expect(pipe.transform('false', 'activeInactive')).toBe('bg-gray-500/15 text-gray-400');
    });

    it('should handle boolean input converted to string', () => {
      expect(pipe.transform(true, 'activeInactive')).toBe('bg-green-500/15 text-green-400');
      expect(pipe.transform(false, 'activeInactive')).toBe('bg-gray-500/15 text-gray-400');
    });
  });

  describe('invoiceStatus', () => {
    it('should return yellow for draft', () => {
      expect(pipe.transform('draft', 'invoiceStatus')).toBe('bg-yellow-500/15 text-yellow-400');
    });

    it('should return green for issued', () => {
      expect(pipe.transform('issued', 'invoiceStatus')).toBe('bg-green-500/15 text-green-400');
    });

    it('should return red for cancelled', () => {
      expect(pipe.transform('cancelled', 'invoiceStatus')).toBe('bg-red-500/15 text-red-400');
    });

    it('should return gray for rejected', () => {
      expect(pipe.transform('rejected', 'invoiceStatus')).toBe('bg-gray-500/15 text-gray-400');
    });
  });

  describe('invoiceType', () => {
    it('should return blue for A', () => {
      expect(pipe.transform('A', 'invoiceType')).toBe('bg-blue-500/15 text-blue-400');
    });

    it('should return green for B', () => {
      expect(pipe.transform('B', 'invoiceType')).toBe('bg-green-500/15 text-green-400');
    });

    it('should return orange for C', () => {
      expect(pipe.transform('C', 'invoiceType')).toBe('bg-orange-500/15 text-orange-400');
    });
  });

  describe('edge cases', () => {
    it('should return default gray for unknown value', () => {
      expect(pipe.transform('unknown_status', 'workOrderStatus')).toBe(
        'bg-gray-500/15 text-gray-400',
      );
    });

    it('should return default gray for empty string', () => {
      expect(pipe.transform('', 'workOrderStatus')).toBe('bg-gray-500/15 text-gray-400');
    });

    it('should handle boolean true for activeInactive', () => {
      expect(pipe.transform(true, 'activeInactive')).toBe('bg-green-500/15 text-green-400');
    });

    it('should handle boolean false for activeInactive', () => {
      expect(pipe.transform(false, 'activeInactive')).toBe('bg-gray-500/15 text-gray-400');
    });
  });
});
