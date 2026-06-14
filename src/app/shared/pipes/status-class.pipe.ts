import { Pipe, PipeTransform } from '@angular/core';

type ClassType =
  | 'workOrderStatus'
  | 'workOrderPriority'
  | 'paymentStatus'
  | 'paymentMethod'
  | 'expenseCategory'
  | 'noteType'
  | 'activeInactive';

const CLASSES: Record<ClassType, Record<string, string>> = {
  workOrderStatus: {
    pending: 'bg-yellow-100 text-yellow-800',
    assigned: 'bg-blue-100 text-blue-800',
    in_progress: 'bg-indigo-100 text-indigo-800',
    postponed: 'bg-gray-100 text-gray-800',
    completed: 'bg-green-100 text-green-800',
    delivered: 'bg-emerald-100 text-emerald-800',
    cancelled: 'bg-red-100 text-red-800',
  },
  workOrderPriority: {
    low: 'bg-gray-100 text-gray-800',
    medium: 'bg-blue-100 text-blue-800',
    high: 'bg-orange-100 text-orange-800',
    urgent: 'bg-red-100 text-red-800',
  },
  paymentStatus: {
    pending: 'bg-yellow-100 text-yellow-800',
    approved: 'bg-green-100 text-green-800',
    rejected: 'bg-red-100 text-red-800',
    refunded: 'bg-blue-100 text-blue-800',
    cancelled: 'bg-gray-100 text-gray-800',
  },
  paymentMethod: {
    cash: 'bg-green-100 text-green-800',
    transfer: 'bg-blue-100 text-blue-800',
    credit_card: 'bg-purple-100 text-purple-800',
    debit_card: 'bg-orange-100 text-orange-800',
  },
  expenseCategory: {
    rent: 'bg-purple-100 text-purple-800',
    utilities: 'bg-blue-100 text-blue-800',
    salaries: 'bg-green-100 text-green-800',
    tools: 'bg-orange-100 text-orange-800',
    transport: 'bg-yellow-100 text-yellow-800',
    advertising: 'bg-pink-100 text-pink-800',
    supplies: 'bg-indigo-100 text-indigo-800',
    maintenance: 'bg-red-100 text-red-800',
    hosting: 'bg-cyan-100 text-cyan-800',
    other: 'bg-gray-100 text-gray-800',
  },
  noteType: {
    diagnosis: 'bg-blue-100 text-blue-800',
    issue: 'bg-red-100 text-red-800',
    observation: 'bg-gray-100 text-gray-800',
    internal: 'bg-yellow-100 text-yellow-800',
  },
  activeInactive: {
    true: 'bg-green-100 text-green-800',
    false: 'bg-gray-100 text-gray-800',
  },
};

@Pipe({ name: 'statusClass' })
export class StatusClassPipe implements PipeTransform {
  transform(value: string | boolean, type: ClassType): string {
    const key = String(value);
    return CLASSES[type]?.[key] ?? 'bg-gray-100 text-gray-800';
  }
}
