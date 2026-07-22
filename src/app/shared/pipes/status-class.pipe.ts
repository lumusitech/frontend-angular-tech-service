import { Pipe, PipeTransform } from '@angular/core';

type ClassType =
  | 'workOrderStatus'
  | 'workOrderPriority'
  | 'paymentStatus'
  | 'paymentMethod'
  | 'expenseCategory'
  | 'noteType'
  | 'activeInactive'
  | 'invoiceStatus'
  | 'invoiceType';

const CLASSES: Record<ClassType, Record<string, string>> = {
  workOrderStatus: {
    pending: 'bg-yellow-500/15 text-yellow-400',
    assigned: 'bg-blue-500/15 text-blue-400',
    on_the_way: 'bg-cyan-500/15 text-cyan-400',
    in_progress: 'bg-indigo-500/15 text-indigo-400',
    postponed: 'bg-gray-500/15 text-gray-400',
    completed: 'bg-green-500/15 text-green-400',
    delivered: 'bg-emerald-500/15 text-emerald-400',
    cancelled: 'bg-red-500/15 text-red-400',
  },
  workOrderPriority: {
    low: 'bg-gray-500/15 text-gray-400',
    medium: 'bg-blue-500/15 text-blue-400',
    high: 'bg-orange-500/15 text-orange-400',
    urgent: 'bg-red-500/15 text-red-400',
  },
  paymentStatus: {
    pending: 'bg-yellow-500/15 text-yellow-400',
    approved: 'bg-green-500/15 text-green-400',
    rejected: 'bg-red-500/15 text-red-400',
    refunded: 'bg-blue-500/15 text-blue-400',
    cancelled: 'bg-gray-500/15 text-gray-400',
  },
  paymentMethod: {
    cash: 'bg-green-500/15 text-green-400',
    transfer: 'bg-blue-500/15 text-blue-400',
    credit_card: 'bg-purple-500/15 text-purple-400',
    debit_card: 'bg-orange-500/15 text-orange-400',
  },
  expenseCategory: {
    rent: 'bg-purple-500/15 text-purple-400',
    utilities: 'bg-blue-500/15 text-blue-400',
    salaries: 'bg-green-500/15 text-green-400',
    tools: 'bg-orange-500/15 text-orange-400',
    transport: 'bg-yellow-500/15 text-yellow-400',
    advertising: 'bg-pink-500/15 text-pink-400',
    supplies: 'bg-indigo-500/15 text-indigo-400',
    maintenance: 'bg-red-500/15 text-red-400',
    hosting: 'bg-cyan-500/15 text-cyan-400',
    other: 'bg-gray-500/15 text-gray-400',
  },
  noteType: {
    diagnosis: 'bg-blue-500/15 text-blue-400',
    issue: 'bg-red-500/15 text-red-400',
    observation: 'bg-gray-500/15 text-gray-400',
    internal: 'bg-yellow-500/15 text-yellow-400',
  },
  activeInactive: {
    true: 'bg-green-500/15 text-green-400',
    false: 'bg-gray-500/15 text-gray-400',
  },
  invoiceStatus: {
    draft: 'bg-yellow-500/15 text-yellow-400',
    issued: 'bg-green-500/15 text-green-400',
    cancelled: 'bg-red-500/15 text-red-400',
    rejected: 'bg-gray-500/15 text-gray-400',
  },
  invoiceType: {
    A: 'bg-blue-500/15 text-blue-400',
    B: 'bg-green-500/15 text-green-400',
    C: 'bg-orange-500/15 text-orange-400',
  },
};

@Pipe({ name: 'statusClass' })
export class StatusClassPipe implements PipeTransform {
  transform(value: string | boolean, type: ClassType): string {
    const key = String(value);
    return CLASSES[type]?.[key] ?? 'bg-gray-500/15 text-gray-400';
  }
}
