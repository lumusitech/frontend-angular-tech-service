import { Pipe, PipeTransform, inject } from '@angular/core';
import { TranslationService } from '../../core/services/translation.service';

type LabelType =
  | 'workOrderStatus'
  | 'workOrderPriority'
  | 'paymentStatus'
  | 'paymentMethod'
  | 'expenseCategory'
  | 'noteType'
  | 'activeInactive'
  | 'invoiceStatus'
  | 'invoiceType';

const VALUE_TO_KEY: Record<string, string> = {
  pending: 'statusLabels.pending',
  assigned: 'statusLabels.assigned',
  on_the_way: 'statusLabels.on_the_way',
  in_progress: 'statusLabels.in_progress',
  postponed: 'statusLabels.postponed',
  completed: 'statusLabels.completed',
  delivered: 'statusLabels.delivered',
  cancelled: 'statusLabels.cancelled',
  low: 'statusLabels.low',
  medium: 'statusLabels.medium',
  high: 'statusLabels.high',
  urgent: 'statusLabels.urgent',
  approved: 'statusLabels.approved',
  rejected: 'statusLabels.rejected',
  refunded: 'statusLabels.refunded',
  cash: 'statusLabels.cash',
  transfer: 'statusLabels.transfer',
  credit_card: 'statusLabels.credit_card',
  debit_card: 'statusLabels.debit_card',
  rent: 'statusLabels.rent',
  utilities: 'statusLabels.utilities',
  salaries: 'statusLabels.salaries',
  tools: 'statusLabels.tools',
  transport: 'statusLabels.transport',
  advertising: 'statusLabels.advertising',
  supplies: 'statusLabels.supplies',
  maintenance: 'statusLabels.maintenance',
  hosting: 'statusLabels.hosting',
  other: 'statusLabels.other',
  diagnosis: 'statusLabels.diagnosis',
  issue: 'statusLabels.issue',
  observation: 'statusLabels.observation',
  internal: 'statusLabels.internal',
  workshop: 'statusLabels.workshop',
  on_site: 'statusLabels.on_site',
  draft: 'statusLabels.draft',
  issued: 'statusLabels.issued',
  A: 'statusLabels.invoiceTypeA',
  B: 'statusLabels.invoiceTypeB',
  C: 'statusLabels.invoiceTypeC',
};

@Pipe({ name: 'statusLabel', pure: false })
export class StatusLabelPipe implements PipeTransform {
  private readonly translationService = inject(TranslationService);

  transform(value: string | boolean, _type: LabelType): string {
    if (typeof value === 'boolean') {
      return value
        ? this.translationService.instant('common.active')
        : this.translationService.instant('common.inactive');
    }

    const key = VALUE_TO_KEY[value];
    if (key) {
      return this.translationService.instant(key);
    }

    return value;
  }
}
